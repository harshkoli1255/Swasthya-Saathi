/**
 * SwasthyaSaathi Clinical Fact Formatter & Humanizer
 * ===================================================
 * Converts raw backend slot values and JSON payloads into clean,
 * intelligible clinical presentations with medical classification badges.
 */

export interface FormattedFact {
  slot: string;
  title: string;
  category: 'complaint' | 'ayush' | 'lifestyle' | 'history';
  categoryLabel: string;
  iconType: 'complaint' | 'severity' | 'duration' | 'agni' | 'thermal' | 'sleep' | 'diet' | 'history' | 'generic';
  primaryValue: string;
  secondaryPill?: {
    text: string;
    tone: 'routine' | 'urgent' | 'emergency' | 'info' | 'neutral';
  };
  ayushContext?: string;
  rawJson?: string;
}

function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function formatClinicalFact(slot: string, value: any): FormattedFact {
  const rawString = typeof value === 'object' ? JSON.stringify(value) : String(value || '');

  // 1. Chief Complaint
  if (slot === 'chief_complaint') {
    let symptom = 'Unspecified Complaint';
    if (typeof value === 'object' && value !== null) {
      symptom = value.symptom || value.raw || value.text || 'Pain / Discomfort';
    } else if (typeof value === 'string') {
      symptom = value;
    }

    return {
      slot,
      title: 'Chief Complaint',
      category: 'complaint',
      categoryLabel: 'Primary Symptom',
      iconType: 'complaint',
      primaryValue: capitalize(symptom),
      secondaryPill: { text: 'Primary Symptom', tone: 'urgent' },
      ayushContext: 'Pradhana Vedana / Mukhya Lakshana',
      rawJson: rawString
    };
  }

  // 2. Severity
  if (slot === 'severity') {
    let level = 'moderate';
    if (typeof value === 'object' && value !== null) {
      level = (value.level || value.severity || value.raw || 'mild').toLowerCase();
    } else if (typeof value === 'string') {
      level = value.toLowerCase();
    }

    const tone = level.includes('severe') ? 'emergency' : level.includes('mod') ? 'urgent' : 'routine';
    const displayLevel = capitalize(level);

    return {
      slot,
      title: 'Symptom Severity',
      category: 'complaint',
      categoryLabel: 'Clinical Intensity',
      iconType: 'severity',
      primaryValue: `${displayLevel} Severity`,
      secondaryPill: { text: `${displayLevel} Intensity`, tone },
      ayushContext: 'Teevrota / Vega (Intensity Assessment)',
      rawJson: rawString
    };
  }

  // 3. Duration
  if (slot === 'duration') {
    let durationText = 'Acute';
    if (typeof value === 'object' && value !== null) {
      if (value.value !== undefined && value.unit) {
        const val = value.value;
        const unit = capitalize(value.unit);
        durationText = `${val} ${unit}`;
      } else if (value.raw) {
        durationText = value.raw;
      }
    } else if (typeof value === 'string') {
      durationText = value;
    }

    return {
      slot,
      title: 'Duration & Chronicity',
      category: 'complaint',
      categoryLabel: 'Timeline & Onset',
      iconType: 'duration',
      primaryValue: durationText,
      secondaryPill: { text: 'Acute Onset', tone: 'info' },
      ayushContext: 'Kala / Kala-Prakarsha (Chronicity)',
      rawJson: rawString
    };
  }

  // 4. Agni / Digestion
  if (slot === 'agni_digestion') {
    let text = 'Balanced Digestion';
    if (typeof value === 'object' && value !== null) {
      text = value.raw || value.description || value.text || 'Acidity & Burning Sensation';
    } else if (typeof value === 'string') {
      text = value;
    }

    return {
      slot,
      title: 'Agni & Jatharagni (Digestive Capacity)',
      category: 'ayush',
      categoryLabel: 'Constitutional Matrix',
      iconType: 'agni',
      primaryValue: text,
      secondaryPill: { text: 'Amlapitta / Pitta Agni', tone: 'urgent' },
      ayushContext: 'Jatharagni Pariksha • Pitta-Prakopa',
      rawJson: rawString
    };
  }

  // 5. Thermal Preference
  if (slot === 'thermal_preference') {
    let text = 'Neutral';
    if (typeof value === 'object' && value !== null) {
      text = value.raw || value.preference || value.text || 'Sensitive to heat / Prefer cool environment';
    } else if (typeof value === 'string') {
      text = value;
    }

    return {
      slot,
      title: 'Thermal Satmya (Heat / Cold Preference)',
      category: 'ayush',
      categoryLabel: 'Constitutional Matrix',
      iconType: 'thermal',
      primaryValue: text,
      secondaryPill: { text: 'Sheeta-Satmya (Heat Sensitive)', tone: 'info' },
      ayushContext: 'Ushna / Sheeta Sahishnuta',
      rawJson: rawString
    };
  }

  // 6. Sleep Pattern
  if (slot === 'sleep_pattern') {
    let text = 'Normal sleep';
    if (typeof value === 'object' && value !== null) {
      text = value.raw || value.pattern || value.text || 'Sound uninterrupted sleep';
    } else if (typeof value === 'string') {
      text = value;
    }

    return {
      slot,
      title: 'Nidra (Sleep Rhythm & Quality)',
      category: 'ayush',
      categoryLabel: 'Constitutional Matrix',
      iconType: 'sleep',
      primaryValue: text,
      secondaryPill: { text: 'Sukha Nidra (Normal)', tone: 'routine' },
      ayushContext: 'Trayopasthambha • Nidra Pariksha',
      rawJson: rawString
    };
  }

  // 7. Lifestyle & Diet
  if (slot === 'lifestyle_diet') {
    let text = 'Balanced vegetarian diet';
    if (typeof value === 'object' && value !== null) {
      text = value.raw || value.diet || value.text || 'Strict vegetarian, regular meal times';
    } else if (typeof value === 'string') {
      text = value;
    }

    return {
      slot,
      title: 'Ahara & Vihara (Diet & Daily Regimen)',
      category: 'lifestyle',
      categoryLabel: 'Habits & Nutrition',
      iconType: 'diet',
      primaryValue: text,
      secondaryPill: { text: 'Shuddha Shakahara', tone: 'routine' },
      ayushContext: 'Ahara Vidhi Vishesha Ayatana',
      rawJson: rawString
    };
  }

  // 8. Past Medical History
  if (slot === 'medical_history') {
    let condition = 'none';
    if (typeof value === 'object' && value !== null) {
      condition = (value.condition || value.raw || value.history || 'none').toLowerCase();
    } else if (typeof value === 'string') {
      condition = value.toLowerCase();
    }

    const isNone = condition === 'none' || condition === 'nil' || condition === 'no';
    const primaryText = isNone 
      ? 'No prior chronic medical conditions or surgeries reported' 
      : capitalize(condition);

    return {
      slot,
      title: 'Past Medical History (Poorva Vyadhi)',
      category: 'history',
      categoryLabel: 'Clinical Background',
      iconType: 'history',
      primaryValue: primaryText,
      secondaryPill: {
        text: isNone ? 'Clear Past History' : 'Pre-existing Condition',
        tone: isNone ? 'routine' : 'urgent'
      },
      ayushContext: 'Poorva Roga Vrittanta',
      rawJson: rawString
    };
  }

  // Generic Fallback
  let readableValue = '';
  if (typeof value === 'string') {
    readableValue = value;
  } else if (typeof value === 'object' && value !== null) {
    if (value.raw) {
      readableValue = value.raw;
    } else {
      readableValue = Object.entries(value)
        .map(([k, v]) => `${capitalize(k.replace(/_/g, ' '))}: ${v}`)
        .join(' • ');
    }
  } else {
    readableValue = String(value || 'Not reported');
  }

  const slotTitle = slot
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());

  return {
    slot,
    title: slotTitle,
    category: 'lifestyle',
    categoryLabel: 'General Observation',
    iconType: 'generic',
    primaryValue: readableValue || 'Recorded in intake',
    secondaryPill: { text: 'Patient Reported', tone: 'neutral' },
    rawJson: rawString
  };
}
