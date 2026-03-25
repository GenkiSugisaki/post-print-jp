import type { RecipientType } from '../types';

export interface RecipientLines {
  companyLine: string | null;
  departmentLine: string | null;
  nameLine: string | null;
}

export function buildRecipientLines(
  recipientType: RecipientType,
  companyName: string,
  department: string,
  personName: string
): RecipientLines {
  if (recipientType === '個人') {
    return {
      companyLine: null,
      departmentLine: null,
      nameLine: personName ? `${personName}　様` : null,
    };
  }

  // 法人
  const hasCompany = companyName.trim() !== '';
  const hasDept = department.trim() !== '';
  const hasPerson = personName.trim() !== '';

  if (!hasCompany) {
    return { companyLine: null, departmentLine: null, nameLine: null };
  }

  if (hasPerson) {
    // 担当者あり → 担当者に様
    return {
      companyLine: companyName,
      departmentLine: hasDept ? department : null,
      nameLine: `${personName}　様`,
    };
  } else if (hasDept) {
    // 部署あり・担当者なし → 部署名に御中
    return {
      companyLine: companyName,
      departmentLine: `${department}　御中`,
      nameLine: null,
    };
  } else {
    // 会社のみ → 会社名に御中
    return {
      companyLine: `${companyName}　御中`,
      departmentLine: null,
      nameLine: null,
    };
  }
}
