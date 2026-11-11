export type RiskSeverity = 'Critical' | 'High' | 'Medium' | 'Low';

export interface DetectedClause {
  ruleId: string;
  riskCategory: string;
  matchedClauseText: string;
  pageNumber: number | null;
  startIndex: number;
  endIndex: number;
  severity: RiskSeverity;
  riskExplanation: string;
  whyItMatters: string;
  suggestedQuestions: string[];
  suggestedNegotiationPoints: string[];
}

export interface RuleDefinition {
  ruleId: string;
  category: string;
  severity: RiskSeverity;
  patterns: RegExp[];
  negativePatterns?: RegExp[];
  riskExplanation: string;
  whyItMatters: string;
  suggestedQuestions: string[];
  suggestedNegotiationPoints: string[];
}

export const CONTRACT_RULES: RuleDefinition[] = [
  // 1. Service Bond & Mandatory Retention
  {
    ruleId: 'RULE_SERVICE_BOND',
    category: 'Service Bond',
    severity: 'Critical',
    patterns: [
      /(?:service\s+bond|retention\s+agreement|mandatory\s+commitment|mandatory\s+service\s+period|mandatory\s+retention)/i,
      /(?:agree(?:s)?\s+to\s+serve\s+for\s+a\s+(?:minimum\s+)?period\s+of|commit(?:s)?\s+to\s+remain\s+with\s+the\s+company\s+for)/i,
      /(?:liquidated\s+damages|reimburse(?:ment)?\s+(?:of\s+)?training\s+(?:cost|fee)|training\s+reimbursement|pay\s+(?:the\s+company|a\s+penalty)\s+of\s+[\$£€₹\d]+)/i,
      /(?:should\s+(?:the\s+)?(?:employee|intern)\s+(?:resign|terminate|leave)\s+(?:before|within|prior\s+to)|fail(?:s)?\s+to\s+complete\s+the\s+full)/i,
    ],
    negativePatterns: [
      /(?:no\s+bond|without\s+any\s+bond|at-will\s+employment\s+without\s+penalty)/i,
    ],
    riskExplanation:
      'This clause binds you to remain with the employer for a mandatory duration, penalizing early resignation with financial liquidated damages or training fee repayment.',
    whyItMatters:
      'Service bonds restrict your career mobility and can trap you in toxic, abusive, or underpaid working environments under threat of heavy financial liabilities.',
    suggestedQuestions: [
      'Is there an option for a mutual trial period where either party may exit without financial penalty?',
      'Can you specify exactly what tangible formal external training certifications justify this fee?',
      'Does the repayment amount depreciate on a prorated monthly basis over time?'
    ],
    suggestedNegotiationPoints: [
      'Request complete removal of the liquidated damages clause, affirming standard at-will employment.',
      'Propose a prorated reduction of any training costs (e.g. reduced by 1/12th for every month served).',
      'Ensure the bond does not apply if you resign due to employer breach, harassment, or delayed pay.'
    ]
  },

  // 2. Non-Compete Restrictions
  {
    ruleId: 'RULE_NON_COMPETE',
    category: 'Non-Compete Restrictions',
    severity: 'High',
    patterns: [
      /(?:non-compete|non\s+compete|covenant\s+not\s+to\s+compete|restraint\s+of\s+trade)/i,
      /(?:shall\s+not(?:\s+directly\s+or\s+indirectly)?\s+(?:engage\s+in|work\s+for|be\s+employed\s+by|consult\s+with|perform\s+services\s+for)\s+(?:any\s+)?competitor)/i,
      /(?:for\s+a\s+period\s+of\s+(?:\d+|twelve|twenty-four|six)\s+months\s+(?:following|after)\s+(?:termination|cessation|separation))/i,
      /(?:within\s+a\s+(?:\d+|fifty|hundred)\s*-?\s*mile\s+radius|in\s+the\s+company's\s+active\s+(?:international\s+)?markets)/i
    ],
    negativePatterns: [
      /(?:non-compete\s+clauses\s+are\s+excluded|no\s+restriction\s+on\s+future\s+employment)/i
    ],
    riskExplanation:
      'This clause restricts your ability to seek employment, freelance, or launch a venture in your industry or geographic region after leaving the company.',
    whyItMatters:
      'Overly broad non-competes can legally bar you from utilizing your professional skills, causing prolonged unemployment or forced career redirection without compensation.',
    suggestedQuestions: [
      'Will the company pay 100% garden leave salary during the post-employment restricted period?',
      'Can we define the exact list of direct competitors rather than using a broad blanket prohibition?',
      'Does this restriction apply even if employment is terminated by the company without cause?'
    ],
    suggestedNegotiationPoints: [
      'Shorten the non-compete duration from 12+ months down to 3 months or waive it entirely for junior/intern roles.',
      'Narrow the scope to a specified list of 3-5 named competitors rather than the entire industry.',
      'Add a clause that non-compete is void if the company initiates layoff or termination without cause.'
    ]
  },

  // 3. Automatic Renewal
  {
    ruleId: 'RULE_AUTO_RENEWAL',
    category: 'Automatic Renewal',
    severity: 'Medium',
    patterns: [
      /(?:automatic(?:ally)?\s+renew(?:s|ed|al)?|evergreen\s+clause|shall\s+automatically\s+extend)/i,
      /(?:unless\s+(?:either\s+party\s+)?gives\s+written\s+notice\s+at\s+least\s+\d+\s+days\s+prior)/i,
      /(?:renew(?:s)?\s+for\s+successive\s+(?:one-year|annual|monthly)\s+periods)/i
    ],
    negativePatterns: [
      /(?:will\s+not\s+automatically\s+renew|requires\s+mutual\s+written\s+agreement\s+to\s+renew)/i
    ],
    riskExplanation:
      'The contract will automatically renew for additional terms unless you provide timely written notice during a narrow pre-determined window.',
    whyItMatters:
      'Missing the narrow cancellation window locks you into subsequent contract cycles, subscription fees, or service obligations you may no longer want.',
    suggestedQuestions: [
      'What is the exact deadline and procedure for declining automatic extension?',
      'Does the company send advance reminder notices before the renewal window closes?'
    ],
    suggestedNegotiationPoints: [
      'Require the other party to deliver written reminder notice 30 days prior to the auto-renewal deadline.',
      'Allow cancellation with 30 days notice at any point during renewed terms without termination penalties.'
    ]
  },

  // 4. Unilateral Modification
  {
    ruleId: 'RULE_UNILATERAL_MODIFICATION',
    category: 'Unilateral Modification',
    severity: 'High',
    patterns: [
      /(?:unilateral(?:ly)?\s+(?:right|modify|change)|modify\s+(?:these\s+terms|any\s+terms)\s+at\s+its\s+sole\s+discretion)/i,
      /(?:reserves\s+the\s+right\s+to\s+(?:amend|alter|decrease|change|modify)\s+(?:any\s+terms|compensation|policies)\s+(?:at\s+any\s+time)?\s+without\s+(?:prior\s+)?(?:consultation|notice|consent))/i,
      /(?:at\s+its\s+sole\s+discretion\s+and\s+without\s+liability|change\s+without\s+notice)/i
    ],
    riskExplanation:
      'The contract permits the drafting party to unilaterally alter terms, pay scales, duties, or policies without requiring your consent or providing meaningful advance notice.',
    whyItMatters:
      'This undermines contract certainty, allowing the other party to reduce wages, increase obligations, or change expectations whenever convenient for them.',
    suggestedQuestions: [
      'Why is employee consent not required for material modifications to compensation or duties?',
      'How much advance written notice will be guaranteed before any policy change takes effect?'
    ],
    suggestedNegotiationPoints: [
      'Insert language requiring mutual written agreement signed by both parties for any material amendments.',
      'Guarantee at least 30 days advance notice and the unconditional right to terminate without penalty if unfavorable changes are introduced.'
    ]
  },

  // 5. Salary Deductions & Withholding
  {
    ruleId: 'RULE_SALARY_DEDUCTIONS',
    category: 'Salary Deductions',
    severity: 'Critical',
    patterns: [
      /(?:deduct(?:ion)?|withhold(?:ing)?|forfeit(?:ure)?)\s+(?:from\s+)?(?:the\s+)?(?:employee'?s?\s+)?(?:monthly\s+)?(?:stipend|salary|wage|final\s+settlement)/i,
      /(?:any\s+amounts\s+deemed\s+necessary|deemed\s+by\s+management\s+to\s+cover\s+(?:any\s+)?(?:operational\s+errors|losses|depreciation))/i,
      /(?:penalty\s+charges|financial\s+fines|forfeiture\s+of\s+earned\s+(?:wages|salary))/i,
      /(?:discretionary\s+deduction|payroll\s+withholding\s+for\s+damage)/i
    ],
    negativePatterns: [
      /(?:statutory\s+tax\s+deductions|deductions\s+required\s+by\s+law|as\s+authorized\s+in\s+writing\s+by\s+employee)/i
    ],
    riskExplanation:
      'The company grants itself broad authority to withhold or forfeit your earned salary or stipend for operational errors, alleged damages, or arbitrary penalties.',
    whyItMatters:
      'In many jurisdictions, arbitrary wage forfeiture is illegal; such clauses leave you vulnerable to wage theft or withheld final settlements with no dispute recourse.',
    suggestedQuestions: [
      'What objective guidelines and evidence-gathering processes exist before any deduction can be proposed?',
      'Is there an independent grievance or appeal mechanism for contested deductions?'
    ],
    suggestedNegotiationPoints: [
      'Limit deductions strictly to statutory tax requirements or express written authorization per incident.',
      'Remove all clauses permitting forfeiture of earned compensation or final paycheck settlements.'
    ]
  },

  // 6. Unpaid Notice Period & Notice Inequities
  {
    ruleId: 'RULE_UNPAID_NOTICE',
    category: 'Unpaid Notice Period',
    severity: 'High',
    patterns: [
      /(?:ninety\s*\(?90\)?\s*days\s+written\s+notice|notice\s+period\s+of\s+90\s+days|three\s*\(?3\)?\s*months\s+notice)/i,
      /(?:waive\s+the\s+notice\s+period\s+without\s+(?:any\s+)?obligation\s+to\s+pay\s+salary\s+in\s+lieu)/i,
      /(?:unpaid\s+notice\s+period|working\s+without\s+compensation\s+during\s+notice)/i,
      /(?:resignation\s+during\s+the\s+first\s+\d+\s+months\s+is\s+strictly\s+prohibited)/i
    ],
    riskExplanation:
      'This clause establishes an excessively long notice period (e.g., 90 days), prohibits early resignation, or allows the company to terminate immediately without pay in lieu of notice.',
    whyItMatters:
      'A 90-day notice period often causes prospective employers to rescind job offers. Furthermore, unilateral notice waiver without pay leaves you abruptly without income.',
    suggestedQuestions: [
      'Is the notice period balanced and reciprocal between employer and employee?',
      'If the company waives the notice period, will full compensation for that period be disbursed as garden leave?'
    ],
    suggestedNegotiationPoints: [
      'Reduce notice period to a standard 15-30 days during probation/internship and 30 days for full-time employment.',
      'Ensure that if the employer waives the notice period, full pay in lieu of notice is guaranteed.'
    ]
  },

  // 7. Data Sharing Permissions & Surveillance
  {
    ruleId: 'RULE_DATA_PERMISSIONS',
    category: 'Data Sharing Permissions',
    severity: 'Medium',
    patterns: [
      /(?:unrestricted\s+rights\s+to\s+monitor|monitor,\s*record,\s*process,\s*store)/i,
      /(?:personal\s+device\s+telemetry|browsing\s+activity\s+and\s+personal\s+identifiers)/i,
      /(?:transmit\s+.*?\s+to\s+third-party\s+(?:offshore\s+)?marketing|share\s+personal\s+data\s+with\s+affiliates\s+and\s+third\s+parties\s+without\s+(?:further\s+)?notice)/i,
      /(?:irrevocable(?:,\s*unrestricted)?\s+rights\s+to\s+(?:collect|share|monetize)\s+(?:personal|user)\s+data)/i
    ],
    riskExplanation:
      'This provision grants broad permission to collect, monitor, track personal devices, or sell/transfer your personal data to third parties without further consent.',
    whyItMatters:
      'Broad data rights infringe on your privacy rights and may permit invasive surveillance of personal devices or sharing of sensitive credentials.',
    suggestedQuestions: [
      'Does company monitoring apply strictly to company-owned devices or to personal devices as well?',
      'Which specific third-party entities receive personal data, and for what defined operational purpose?'
    ],
    suggestedNegotiationPoints: [
      'Explicitly restrict employer monitoring solely to company-owned hardware and corporate network access.',
      'Remove all clauses permitting transfer or commercialization of employee/user personal data with marketing affiliates.'
    ]
  },

  // 8. Termination Restrictions
  {
    ruleId: 'RULE_TERMINATION_RESTRICTIONS',
    category: 'Termination Restrictions',
    severity: 'High',
    patterns: [
      /(?:resignation\s+.*?\s+is\s+strictly\s+prohibited|shall\s+not\s+have\s+the\s+right\s+to\s+terminate)/i,
      /(?:without\s+prior\s+written\s+board\s+consent|subject\s+to\s+approval\s+by\s+management)/i,
      /(?:lock-in\s+period\s+of|cannot\s+resign\s+during)/i,
      /(?:company\s+may\s+terminate\s+at\s+will.*?employee\s+may\s+not)/i
    ],
    riskExplanation:
      'The agreement restricts your right to resign, requiring discretionary board/managerial approval or imposing an absolute lock-in period.',
    whyItMatters:
      'You cannot be legally forced to work against your will. Conditioning resignation on employer approval violates fundamental labor standards.',
    suggestedQuestions: [
      'Under what conditions can the employee terminate the agreement if the employer fails to perform?',
      'Why is management or board consent required for voluntary resignation?'
    ],
    suggestedNegotiationPoints: [
      'Establish a clear, unconditional right to terminate with reasonable written notice (e.g. 14 to 30 days).',
      'Remove all terms requiring board or managerial approval before an employee resignation is accepted.'
    ]
  },

  // 9. Intellectual Property Ownership Beyond Scope
  {
    ruleId: 'RULE_IP_OWNERSHIP',
    category: 'Intellectual Property Ownership',
    severity: 'High',
    patterns: [
      /(?:all\s+(?:worldwide\s+)?rights,\s*title,\s*and\s*interest\s+in\s+any\s+and\s+all\s+inventions)/i,
      /(?:whether\s+developed\s+on\s+company\s+premises.*?or\s+independently\s+on\s+personal\s+equipment)/i,
      /(?:during\s+off-duty\s+hours|personal\s+time\s+and\s+personal\s+devices|unrelated\s+to\s+the\s+company's\s+business)/i,
      /(?:assign(?:s)?\s+all\s+prior\s+inventions|irrevocably\s+transfers\s+all\s+future\s+creative\s+materials)/i
    ],
    negativePatterns: [
      /(?:excluding\s+inventions\s+developed\s+on\s+personal\s+time\s+without\s+company\s+equipment|inventions\s+unrelated\s+to\s+company\s+business\s+are\s+excluded)/i
    ],
    riskExplanation:
      'The contract claims ownership over everything you create—even works created on your personal time, using personal equipment, and entirely unrelated to company business.',
    whyItMatters:
      'Signing broad IP clauses surrenders ownership of your personal open-source projects, personal side hustles, prior creations, and future independent ideas.',
    suggestedQuestions: [
      'Can we attach an Exhibit listing all my pre-existing inventions and side projects to exclude them?',
      'Does the assignment apply solely to intellectual property created directly within the scope of company employment?'
    ],
    suggestedNegotiationPoints: [
      'Limit IP assignment strictly to inventions created during working hours, using company assets, and directly related to company business.',
      'Add a standard carve-out for personal hobbies, independent side projects, and prior works created on personal time.'
    ]
  },

  // 10. Liability and Indemnification
  {
    ruleId: 'RULE_LIABILITY_INDEMNIFICATION',
    category: 'Liability and Indemnification',
    severity: 'Medium',
    patterns: [
      /(?:fully\s+indemnify,\s*defend,\s*and\s*hold\s+harmless|agree(?:s)?\s+to\s+indemnify\s+and\s+hold\s+harmless)/i,
      /(?:against\s+all\s+damages,\s*liabilities,\s*and\s+legal\s+expenses\s+incurred)/i,
      /(?:unlimited\s+personal\s+liability|solely\s+liable\s+for\s+any\s+and\s+all\s+losses)/i,
      /(?:waives\s+all\s+claims\s+and\s+statutory\s+rights|hold\s+the\s+company\s+harmless\s+from\s+any\s+negligence)/i
    ],
    riskExplanation:
      'This clause places disproportionate personal financial responsibility and legal indemnification obligations on you for company damages, legal fees, or third-party claims.',
    whyItMatters:
      'As an individual, employee, or contractor, an uncapped indemnification clause can expose you to catastrophic personal bankruptcy over normal business disputes.',
    suggestedQuestions: [
      'Is the company covered by Directors & Officers (D&O) or Errors & Omissions (E&O) insurance that protects staff?',
      'Can the liability be capped at the total compensation paid under this contract?'
    ],
    suggestedNegotiationPoints: [
      'Make indemnification obligations mutual rather than unilateral.',
      'Cap total liability to the amount of fees or wages paid to you over the prior 3 to 6 months.',
      'Exclude ordinary negligence, confining liability strictly to willful misconduct or gross negligence.'
    ]
  }
];

/**
 * Analyzes contract text against the 10 configured rule definitions.
 * Extracts sentence/paragraph surrounding context and prevents duplicate spans.
 */
export function analyzeContractWithRules(fullText: string): DetectedClause[] {
  if (!fullText || typeof fullText !== 'string' || !fullText.trim()) {
    return [];
  }

  const detected: DetectedClause[] = [];
  const normalizedText = fullText;

  // Split into paragraphs/sentences or analyze using sliding window around matches
  for (const rule of CONTRACT_RULES) {
    let matchFound = false;

    // Check if any negative pattern exempts this rule
    let hasNegativeMatch = false;
    if (rule.negativePatterns) {
      for (const neg of rule.negativePatterns) {
        if (neg.test(normalizedText)) {
          hasNegativeMatch = true;
          break;
        }
      }
    }

    if (hasNegativeMatch) {
      continue;
    }

    for (const pattern of rule.patterns) {
      const match = pattern.exec(normalizedText);
      if (match && match.index !== undefined) {
        // Expand match boundaries to full sentence or surrounding paragraph
        const start = Math.max(0, normalizedText.lastIndexOf('\n', match.index));
        let end = normalizedText.indexOf('\n', match.index + match[0].length);
        if (end === -1) end = Math.min(normalizedText.length, match.index + match[0].length + 150);

        // Clean extracted snippet
        const snippet = normalizedText.substring(start, end).trim();

        // Calculate approximate page number based on character count (approx 2,200 chars per page)
        const approxPage = Math.max(1, Math.floor(start / 2200) + 1);

        // Check if already captured an overlapping span for this rule
        const isDuplicate = detected.some(
          d => d.ruleId === rule.ruleId && Math.abs(d.startIndex - start) < 100
        );

        if (!isDuplicate && snippet.length > 15) {
          detected.push({
            ruleId: rule.ruleId,
            riskCategory: rule.category,
            matchedClauseText: snippet,
            pageNumber: approxPage,
            startIndex: start,
            endIndex: end,
            severity: rule.severity,
            riskExplanation: rule.riskExplanation,
            whyItMatters: rule.whyItMatters,
            suggestedQuestions: rule.suggestedQuestions,
            suggestedNegotiationPoints: rule.suggestedNegotiationPoints,
          });
          matchFound = true;
          break; // move to next rule once detected
        }
      }
    }
  }

  return detected;
}
