import React from 'react';
import type { FormattedEnvelope } from '../../utils/formatAddress';
import type { FormattedSender } from '../../utils/formatSender';
import type { LayoutMode } from '../../types';
import { toVerticalText } from '../../utils/verticalText';

interface Props {
  data: FormattedEnvelope;
  sender: FormattedSender | null;
  widthMm: number;
  heightMm: number;
  layout: LayoutMode;
}

// Scale factor normalised to 長形3号 (120mm wide)
const BASE_WIDTH_MM = 120;

export function LabelLayout({ data, sender, widthMm, heightMm, layout }: Props) {
  const s = widthMm / BASE_WIDTH_MM;

  // Font sizes (pt)
  const ADDR_FONT_PT = 11 * s;
  const LARGE_FONT_PT = ADDR_FONT_PT + 3 * s;
  const POSTAL_FONT_PT = 13 * s;
  const SENDER_FONT_PT = 9 * s;

  // 1 indent = 1em of address font (computed in pt to avoid CSS em reference issues)
  const indentUnit = ADDR_FONT_PT;
  const indent1 = indentUnit;
  const indent2 = 2 * indentUnit;
  const indent3 = 3 * indentUnit;

  // Line height for gap calculations
  const addrLineHeight = ADDR_FONT_PT * 1.7;
  const addressLineCount = 1 + (data.addressBuilding ? 1 : 0);
  const recipientGapPt = (4 - addressLineCount) * addrLineHeight;

  // Recipient scenario detection
  const hasOrg = data.recipientOrg !== null;
  const hasDept = data.recipientDept !== null;
  const hasName = data.recipientName !== null;

  if (layout === '縦書き') {
    const labelHeightMm = Math.min(heightMm * 0.65, 160);

    // Vertical font sizes
    const VERT_ADDR_PT = 12 * s;
    const VERT_LARGE_PT = 21 * s;
    const VERT_ORG_PT = 14 * s;
    const vertIndentUnit = VERT_ADDR_PT;
    const vertIndent1 = vertIndentUnit;
    const vertIndent2 = 2 * vertIndentUnit;
    const vertIndent3 = 3 * vertIndentUnit;
    // 2-column gap: 2 character widths at address font size
    const vertColumnGap = 2 * VERT_ADDR_PT * 0.3528; // pt → mm

    const vertCommon: React.CSSProperties = {
      writingMode: 'vertical-rl',
      textOrientation: 'mixed',
      lineHeight: 1.4,
    };

    const renderVerticalRecipient = () => {
      if (!hasOrg && hasName) {
        // Scenario A: individual
        return (
          <div style={{ ...vertCommon, fontSize: `${VERT_LARGE_PT}pt`, color: '#111827', paddingTop: `${vertIndent2}pt` }}>
            {data.recipientName}
          </div>
        );
      }
      if (hasOrg && !hasDept && !hasName) {
        // Scenario B: company only (with 御中)
        return (
          <div style={{ ...vertCommon, fontSize: `${VERT_LARGE_PT}pt`, color: '#111827', paddingTop: `${vertIndent2}pt` }}>
            {data.recipientOrg}
          </div>
        );
      }
      if (hasOrg && hasDept && hasName) {
        // Scenario C: company + dept + person (dept+name on same column)
        return (
          <>
            <div style={{ ...vertCommon, fontSize: `${VERT_ORG_PT}pt`, color: '#111827', paddingTop: `${vertIndent3}pt` }}>
              {data.recipientDept}{'　'}{data.recipientName}
            </div>
            <div style={{ ...vertCommon, fontSize: `${VERT_ORG_PT}pt`, color: '#111827', paddingTop: `${vertIndent2}pt` }}>
              {data.recipientOrg}
            </div>
          </>
        );
      }
      if (hasOrg && !hasDept && hasName) {
        // Scenario D: company + person (no dept), blank column between
        return (
          <>
            <div style={{ ...vertCommon, fontSize: `${VERT_LARGE_PT}pt`, color: '#111827', paddingTop: `${vertIndent3}pt` }}>
              {data.recipientName}
            </div>
            {/* Spacer for 1 blank column */}
            <div style={{ width: `${VERT_ORG_PT * 1.4}pt` }} />
            <div style={{ ...vertCommon, fontSize: `${VERT_ORG_PT}pt`, color: '#111827', paddingTop: `${vertIndent2}pt` }}>
              {data.recipientOrg}
            </div>
          </>
        );
      }
      if (hasOrg && hasDept && !hasName) {
        // Scenario E: company + dept (with 御中)
        return (
          <>
            <div style={{ ...vertCommon, fontSize: `${VERT_ORG_PT}pt`, color: '#111827', paddingTop: `${vertIndent3}pt` }}>
              {data.recipientDept}
            </div>
            <div style={{ ...vertCommon, fontSize: `${VERT_ORG_PT}pt`, color: '#111827', paddingTop: `${vertIndent2}pt` }}>
              {data.recipientOrg}
            </div>
          </>
        );
      }
      return null;
    };

    return (
      <div
        style={{
          width: `${widthMm}mm`,
          height: `${labelHeightMm}mm`,
          padding: `${4 * s}mm ${5 * s}mm`,
          fontFamily: '"Hiragino Mincho ProN", "Yu Mincho", "MS Mincho", serif',
          boxSizing: 'border-box',
          backgroundColor: 'white',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Postal code above the grid so it gets full width */}
        {data.postalCode && (
          <div
            style={{
              writingMode: 'horizontal-tb',
              fontSize: `${11 * s}pt`,
              color: '#374151',
              marginBottom: `${2 * s}mm`,
              letterSpacing: '0.05em',
              textAlign: 'right',
            }}
          >
            〒{data.postalCode}
          </div>
        )}

        <div
          style={{
            flex: 1,
            display: 'grid',
            gridTemplateColumns: sender ? `auto 1fr auto` : '1fr auto',
            gap: `${Math.max(vertColumnGap, 3 * s)}mm`,
            overflow: 'hidden',
          }}
        >
          {/* Left column: sender */}
          {sender && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: `${1.5 * s}mm`,
                borderRight: `0.5px solid #9ca3af`,
                paddingRight: `${2.5 * s}mm`,
                alignItems: 'flex-start',
              }}
            >
              {sender.postalCode && (
                <div
                  style={{
                    writingMode: 'horizontal-tb',
                    fontSize: `${8 * s}pt`,
                    color: '#6b7280',
                    alignSelf: 'flex-start',
                  }}
                >
                  {sender.postalCode}
                </div>
              )}
              {(() => {
                // Extra top offset so address columns start below the postal code line + 1 blank line
                const senderPostalGap = sender.postalCode ? 8 * s * 1.4 + SENDER_FONT_PT : 0;
                return (
                  <>
                    {sender.name && (
                      <div
                        style={{
                          writingMode: 'vertical-rl',
                          textOrientation: 'mixed',
                          fontSize: `${SENDER_FONT_PT}pt`,
                          color: '#6b7280',
                          lineHeight: 1.4,
                          paddingTop: `${vertIndent1 + senderPostalGap}pt`,
                        }}
                      >
                        {toVerticalText(sender.name)}
                      </div>
                    )}
                    {sender.building && (
                      <div
                        style={{
                          writingMode: 'vertical-rl',
                          textOrientation: 'mixed',
                          fontSize: `${SENDER_FONT_PT}pt`,
                          color: '#6b7280',
                          lineHeight: 1.4,
                          paddingTop: `${vertIndent1 + senderPostalGap}pt`,
                        }}
                      >
                        {toVerticalText(sender.building)}
                      </div>
                    )}
                    {sender.address && (
                      <div
                        style={{
                          writingMode: 'vertical-rl',
                          textOrientation: 'mixed',
                          fontSize: `${SENDER_FONT_PT}pt`,
                          color: '#6b7280',
                          lineHeight: 1.4,
                          paddingTop: `${senderPostalGap}pt`,
                        }}
                      >
                        {toVerticalText(sender.address)}
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          )}

          {/* Center column: recipient */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'flex-start',
              gap: `${2 * s}mm`,
            }}
          >
            {renderVerticalRecipient()}
          </div>

          {/* Right column: address */}
          <div key={data.addressBuilding ? 'b' : 'nb'} style={{ display: 'flex', flexDirection: 'row', gap: `${1.5 * s}mm` }}>
            {data.addressBuilding && (
              <div
                style={{
                  ...vertCommon,
                  fontSize: `${VERT_ADDR_PT}pt`,
                  color: '#374151',
                  paddingTop: `${vertIndent1}pt`,
                }}
              >
                {toVerticalText(data.addressBuilding)}
              </div>
            )}
            <div
              style={{
                ...vertCommon,
                fontSize: `${VERT_ADDR_PT}pt`,
                color: '#374151',
              }}
            >
              {toVerticalText(data.addressPrefCity)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── 横書き layout ──
  const renderHorizontalRecipient = () => {
    if (!hasOrg && hasName) {
      // Scenario A: individual
      return (
        <div style={{ paddingLeft: `${indent2}pt`, fontSize: `${LARGE_FONT_PT}pt`, color: '#111827', lineHeight: 1.6 }}>
          {data.recipientName}
        </div>
      );
    }
    if (hasOrg && !hasDept && !hasName) {
      // Scenario B: company only (with 御中)
      return (
        <div style={{ paddingLeft: `${indent2}pt`, fontSize: `${LARGE_FONT_PT}pt`, color: '#111827', lineHeight: 1.6 }}>
          {data.recipientOrg}
        </div>
      );
    }
    if (hasOrg && hasDept && hasName) {
      // Scenario C: company + dept + person
      return (
        <>
          <div style={{ paddingLeft: `${indent2}pt`, fontSize: `${ADDR_FONT_PT}pt`, color: '#374151', lineHeight: 1.6 }}>
            {data.recipientOrg}
          </div>
          <div style={{ paddingLeft: `${indent3}pt`, fontSize: `${LARGE_FONT_PT}pt`, color: '#111827', lineHeight: 1.6 }}>
            {data.recipientDept}{'　'}{data.recipientName}
          </div>
        </>
      );
    }
    if (hasOrg && !hasDept && hasName) {
      // Scenario D: company + person (no dept), 1 blank line between
      return (
        <>
          <div style={{ paddingLeft: `${indent2}pt`, fontSize: `${ADDR_FONT_PT}pt`, color: '#374151', lineHeight: 1.6 }}>
            {data.recipientOrg}
          </div>
          <div
            style={{
              paddingLeft: `${indent3}pt`,
              fontSize: `${LARGE_FONT_PT}pt`,
              color: '#111827',
              lineHeight: 1.6,
              marginTop: `${addrLineHeight}pt`,
            }}
          >
            {data.recipientName}
          </div>
        </>
      );
    }
    if (hasOrg && hasDept && !hasName) {
      // Scenario E: company + dept (with 御中)
      return (
        <>
          <div style={{ paddingLeft: `${indent2}pt`, fontSize: `${ADDR_FONT_PT}pt`, color: '#374151', lineHeight: 1.6 }}>
            {data.recipientOrg}
          </div>
          <div style={{ paddingLeft: `${indent3}pt`, fontSize: `${LARGE_FONT_PT}pt`, color: '#111827', lineHeight: 1.6 }}>
            {data.recipientDept}
          </div>
        </>
      );
    }
    return null;
  };

  return (
    <div
      style={{
        width: `${widthMm}mm`,
        padding: `${5 * s}mm ${6 * s}mm`,
        fontFamily: '"Hiragino Mincho ProN", "Yu Mincho", "MS Mincho", serif',
        boxSizing: 'border-box',
        backgroundColor: 'white',
      }}
    >
      {data.postalCode && (
        <div style={{ fontSize: `${POSTAL_FONT_PT}pt`, marginBottom: `${2 * s}mm`, color: '#374151', letterSpacing: '0.05em' }}>
          〒{data.postalCode}
        </div>
      )}
      <div style={{ fontSize: `${ADDR_FONT_PT}pt`, color: '#374151', lineHeight: 1.7 }}>
        <div>{data.addressPrefCity}</div>
        {data.addressBuilding && (
          <div style={{ paddingLeft: `${indent1}pt` }}>{data.addressBuilding}</div>
        )}
      </div>
      <div style={{ marginTop: `${recipientGapPt}pt` }}>
        {renderHorizontalRecipient()}
      </div>
      {sender && (
        <>
          <hr style={{ border: 'none', borderTop: '0.5px solid #9ca3af', margin: `${3 * s}mm 0` }} />
          <div style={{ fontSize: `${SENDER_FONT_PT}pt`, color: '#6b7280', textAlign: 'right', lineHeight: 1.7 }}>
            {sender.postalCode && <div>{sender.postalCode}</div>}
            {sender.address && <div>{sender.address}</div>}
            {sender.building && <div>{sender.building}</div>}
            {sender.name && <div>{sender.name}</div>}
          </div>
        </>
      )}
    </div>
  );
}
