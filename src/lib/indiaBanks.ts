import banksData from 'banks-in-india/src/datasets/core/banksData.json';
import neftIfscs from 'banks-in-india/src/datasets/rbi/neft-ifscs.json';

import { INDIA_STATES } from './indiaLocations';

export type BankType = 'commercial' | 'rural' | 'cooperative';

type BankDatasetGroup = {
  title: string;
  category: string;
  content: Array<{
    name: string;
    ifsc?: string;
  }>;
};

type NeftBranchRecord = {
  BANK: string;
  IFSC: string;
  STATE: string;
};

type BankRecord = {
  name: string;
  bankType: BankType;
  searchKey: string;
  states: Set<string>;
};

const COMMERCIAL_CATEGORIES = new Set([
  'public_sector_banks',
  'private_sector_banks',
  'sfb',
  'pb',
  'lab',
  'foreign_banks'
]);

const COOPERATIVE_NAME_PATTERN = /(?:COOPERATIVE|CO-OPERATIVE|SAHAKARI|NAGARI|URBAN BANK|MERCANTILE BANK|PEOPLES CO|PEOPLE'S CO|CO OP|CO-OP)/i;

const NORMALIZED_STATES = new Map(
  INDIA_STATES.map((stateName) => [normalizeKey(stateName), stateName] as const)
);

const STATE_ALIASES: Record<string, string> = {
  'andaman and nicobar islands': 'Andaman and Nicobar Islands',
  'andaman nicobar islands': 'Andaman and Nicobar Islands',
  'dadra and nagar haveli and daman and diu': 'Dadra and Nagar Haveli and Daman and Diu',
  'jammu and kashmir': 'Jammu and Kashmir',
  'jammu kashmir': 'Jammu and Kashmir',
  'nct of delhi': 'Delhi',
  'new delhi': 'Delhi',
  'orissa': 'Odisha',
  'pondicherry': 'Puducherry',
  'tamilnadu': 'Tamil Nadu',
  'uttaranchal': 'Uttarakhand'
};

const stateBankMap = new Map<string, Set<string>>();
for (const record of neftIfscs as NeftBranchRecord[]) {
  const resolvedState = resolveStateName(record.STATE);
  if (!resolvedState) continue;

  const bankKey = normalizeKey(record.BANK);
  const existingStates = stateBankMap.get(bankKey) || new Set<string>();
  existingStates.add(resolvedState);
  stateBankMap.set(bankKey, existingStates);
}

const bankRecords = new Map<string, BankRecord>();
const bankDataset = banksData as { banks: BankDatasetGroup[] };

for (const group of bankDataset.banks) {
  const bankType = group.category === 'rrb' ? 'rural' : COMMERCIAL_CATEGORIES.has(group.category) ? 'commercial' : null;
  if (!bankType) continue;

  for (const bank of group.content) {
    const normalizedName = normalizeKey(bank.name);
    const states = new Set(stateBankMap.get(normalizedName) || []);

    if (bankType === 'commercial' && states.size === 0) {
      for (const stateName of INDIA_STATES) {
        states.add(stateName);
      }
    }

    bankRecords.set(normalizedName, {
      name: bank.name,
      bankType,
      searchKey: `${normalizedName} ${normalizeKey(bank.ifsc || '')}`.trim(),
      states
    });
  }
}

for (const record of neftIfscs as NeftBranchRecord[]) {
  const resolvedState = resolveStateName(record.STATE);
  if (!resolvedState) continue;

  const normalizedName = normalizeKey(record.BANK);
  if (bankRecords.has(normalizedName)) {
    const existing = bankRecords.get(normalizedName);
    if (existing) {
      existing.states.add(resolvedState);
    }
    continue;
  }

  if (!COOPERATIVE_NAME_PATTERN.test(record.BANK)) continue;

  bankRecords.set(normalizedName, {
    name: formatBankName(record.BANK),
    bankType: 'cooperative',
    searchKey: `${normalizedName} ${normalizeKey(record.IFSC || '')}`.trim(),
    states: new Set([resolvedState])
  });
}

const BANK_OPTIONS = Array.from(bankRecords.values()).sort((left, right) =>
  left.name.localeCompare(right.name)
);

export function getBankSuggestions(bankType: string, state: string, query: string) {
  const normalizedQuery = normalizeKey(query);
  const resolvedType = resolveBankType(bankType);
  const resolvedState = resolveStateName(state);

  return BANK_OPTIONS.filter((bankRecord) => {
    if (resolvedType && bankRecord.bankType !== resolvedType) return false;
    if (resolvedState && bankRecord.states.size > 0 && !bankRecord.states.has(resolvedState)) return false;
    if (!normalizedQuery) return true;
    return bankRecord.searchKey.includes(normalizedQuery);
  }).map((bankRecord) => bankRecord.name);
}

export function resolveBankName(bankType: string, state: string, bankName: string) {
  const normalizedBankName = normalizeKey(bankName);
  const resolvedType = resolveBankType(bankType);
  const resolvedState = resolveStateName(state);

  const match = BANK_OPTIONS.find((bankRecord) => {
    if (resolvedType && bankRecord.bankType !== resolvedType) return false;
    if (resolvedState && bankRecord.states.size > 0 && !bankRecord.states.has(resolvedState)) return false;
    return normalizeKey(bankRecord.name) === normalizedBankName;
  });

  return match?.name || '';
}

function resolveBankType(bankType: string): BankType | null {
  if (bankType === 'commercial' || bankType === 'rural' || bankType === 'cooperative') {
    return bankType;
  }

  return null;
}

function resolveStateName(stateName: string) {
  if (!stateName) return '';

  const normalizedState = normalizeKey(stateName);
  return STATE_ALIASES[normalizedState] || NORMALIZED_STATES.get(normalizedState) || stateName;
}

function normalizeKey(value: string) {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '')
    .trim();
}

function formatBankName(bankName: string) {
  return bankName
    .toLowerCase()
    .split(/\s+/)
    .map((word) => {
      if (!word) return word;
      if (word.includes('&') || /^[a-z0-9]{1,4}$/.test(word)) {
        return word.toUpperCase();
      }

      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ')
    .replace(/\band\b/g, 'and');
}