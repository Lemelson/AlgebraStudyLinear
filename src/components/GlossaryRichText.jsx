import GlossaryText from './GlossaryText';
import MathText from './MathText';

const MATH_SEGMENTS = /(\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\]|\$[^$\n]+?\$|\\\([\s\S]*?\\\))/g;
const LEGACY_MATH_SEGMENTS = /([A-Za-zΑ-Ωα-ω0-9()[\]{}|√−+*/^_.,\s⁰¹²³⁴⁵⁶⁷⁸⁹⁻ᵀ₀₁₂₃₄₅₆₇₈₉⟨⟩]{0,90}(?:=|≠|∈|∉|⊂|↦|→|≤|≥|⊥)[A-Za-zΑ-Ωα-ω0-9()[\]{}|√−+*/^_.,\s⁰¹²³⁴⁵⁶⁷⁸⁹⁻ᵀ₀₁₂₃₄₅₆₇₈₉⟨⟩]{1,90})/g;

function ProseWithLegacyMath({ text, excludeId, partIndex }) {
  const pieces = text.split(LEGACY_MATH_SEGMENTS).filter(Boolean);
  return pieces.map((piece, index) => {
    const isMath = /(?:=|≠|∈|∉|⊂|↦|→|≤|≥|⊥)/.test(piece) && !/[А-Яа-яЁё]/.test(piece);
    if (isMath) return <MathText key={`${partIndex}-${index}-${piece}`} text={`$${piece.trim()}$`} inline />;
    return <GlossaryText key={`${partIndex}-${index}-${piece}`} excludeId={excludeId}>{piece}</GlossaryText>;
  });
}

export default function GlossaryRichText({ children, excludeId = null, className = '' }) {
  const source = String(children ?? '');
  const parts = source.split(MATH_SEGMENTS).filter(Boolean);

  return <span className={className}>{parts.map((part, index) => {
    if (part.startsWith('$') || part.startsWith('\\[') || part.startsWith('\\(')) {
      return <MathText key={`${index}-${part}`} text={part} inline />;
    }
    return <ProseWithLegacyMath key={`${index}-${part}`} text={part} excludeId={excludeId} partIndex={index} />;
  })}</span>;
}
