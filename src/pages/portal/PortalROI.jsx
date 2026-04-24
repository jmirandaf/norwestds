import { useMemo, useState } from 'react'
import PortalLayout from '../../components/PortalLayout'
import '../../styles/tools.css'

const fmt = (n) =>
  n >= 1_000_000
    ? `$${(n / 1_000_000).toFixed(2)}M`
    : `$${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`

const fmtPct = (n) => `${n.toFixed(1)}%`

const DEFAULT = {
  operators: 4,
  hoursPerShift: 8,
  shiftsPerDay: 2,
  workDaysPerYear: 250,
  hourlyWage: 18,
  benefitsMultiplier: 1.3,
  defectsPerHour: 2.5,
  defectCost: 45,
  downtimeHoursPerMonth: 12,
  downtimeCostPerHour: 320,
  automationInvestment: 280000,
  maintenancePct: 5,
  efficiencyGain: 85,
}

function NumInput({ label, value, onChange, unit, min = 0, step = 1, hint }) {
  return (
    <div className="nds-tool-field">
      <label className="nds-tool-label">
        {label}
        {hint && <span className="nds-tool-hint">{hint}</span>}
      </label>
      <div className="nds-tool-input-wrap">
        {unit && unit !== '%' && unit !== 'x' && <span className="nds-tool-unit nds-tool-unit--pre">{unit}</span>}
        <input
          type="number"
          className="nds-tool-input"
          value={value}
          min={min}
          step={step}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        {(unit === '%' || unit === 'x') && <span className="nds-tool-unit nds-tool-unit--post">{unit}</span>}
      </div>
    </div>
  )
}

function KpiCard({ label, value, sub, accent }) {
  return (
    <div className={`nds-roi-kpi${accent ? ' nds-roi-kpi--accent' : ''}`}>
      <div className="nds-roi-kpi-val">{value}</div>
      <div className="nds-roi-kpi-lbl">{label}</div>
      {sub && <div className="nds-roi-kpi-sub">{sub}</div>}
    </div>
  )
}

export default function PortalROI() {
  const [f, setF] = useState(DEFAULT)
  const set = (k) => (v) => setF((p) => ({ ...p, [k]: v }))

  const calc = useMemo(() => {
    const hoursPerYear = f.operators * f.hoursPerShift * f.shiftsPerDay * f.workDaysPerYear
    const laborCost = hoursPerYear * f.hourlyWage * f.benefitsMultiplier

    const totalPieces = f.operators * f.hoursPerShift * f.shiftsPerDay * f.workDaysPerYear * 1
    const defectsPerYear = f.defectsPerHour * f.hoursPerShift * f.shiftsPerDay * f.workDaysPerYear
    const defectLoss = defectsPerYear * f.defectCost

    const downtimeLoss = f.downtimeHoursPerMonth * 12 * f.downtimeCostPerHour

    const totalCurrentCost = laborCost + defectLoss + downtimeLoss

    const automationLaborSavings = laborCost * (f.efficiencyGain / 100)
    const automationDefectReduction = defectLoss * 0.85
    const automationDowntimeReduction = downtimeLoss * 0.7
    const annualMaintenanceCost = f.automationInvestment * (f.maintenancePct / 100)

    const annualSavings =
      automationLaborSavings + automationDefectReduction + automationDowntimeReduction - annualMaintenanceCost

    const roi = f.automationInvestment > 0 ? (annualSavings / f.automationInvestment) * 100 : 0
    const paybackYears = annualSavings > 0 ? f.automationInvestment / annualSavings : Infinity
    const paybackMonths = isFinite(paybackYears) ? paybackYears * 12 : null

    const fiveYearNetBenefit = annualSavings * 5 - f.automationInvestment

    return {
      laborCost,
      defectLoss,
      downtimeLoss,
      totalCurrentCost,
      annualSavings,
      roi,
      paybackMonths,
      fiveYearNetBenefit,
      automationLaborSavings,
      automationDefectReduction,
      automationDowntimeReduction,
      annualMaintenanceCost,
    }
  }, [f])

  const paybackLabel = calc.paybackMonths
    ? calc.paybackMonths < 12
      ? `${calc.paybackMonths.toFixed(1)} meses`
      : `${(calc.paybackMonths / 12).toFixed(1)} años`
    : '—'

  return (
    <PortalLayout title="Calculadora de ROI" subtitle="Estima el retorno de inversión de un proyecto de automatización">
      <div className="nds-tool-grid">
        {/* ── Inputs ── */}
        <div className="nds-tool-panel">

          <div className="nds-tool-section-title">Personal actual</div>
          <div className="nds-tool-fields">
            <NumInput label="Operadores" value={f.operators} onChange={set('operators')} min={1} />
            <NumInput label="Horas / turno" value={f.hoursPerShift} onChange={set('hoursPerShift')} min={1} />
            <NumInput label="Turnos / día" value={f.shiftsPerDay} onChange={set('shiftsPerDay')} min={1} />
            <NumInput label="Días laborables / año" value={f.workDaysPerYear} onChange={set('workDaysPerYear')} min={1} />
            <NumInput label="Costo / hora" value={f.hourlyWage} onChange={set('hourlyWage')} unit="$" min={1} step={0.5} />
            <NumInput label="Multiplicador de prestaciones" value={f.benefitsMultiplier} onChange={set('benefitsMultiplier')} unit="x" min={1} step={0.05} hint="Salario + beneficios (ej. 1.30)" />
          </div>

          <div className="nds-tool-section-title">Calidad y tiempo muerto</div>
          <div className="nds-tool-fields">
            <NumInput label="Defectos / hora" value={f.defectsPerHour} onChange={set('defectsPerHour')} step={0.1} hint="Piezas defectuosas por hora" />
            <NumInput label="Costo por defecto" value={f.defectCost} onChange={set('defectCost')} unit="$" step={5} />
            <NumInput label="Tiempo muerto / mes" value={f.downtimeHoursPerMonth} onChange={set('downtimeHoursPerMonth')} unit="" hint="Horas de paro al mes" />
            <NumInput label="Costo por hora de paro" value={f.downtimeCostPerHour} onChange={set('downtimeCostPerHour')} unit="$" step={10} />
          </div>

          <div className="nds-tool-section-title">Inversión en automatización</div>
          <div className="nds-tool-fields">
            <NumInput label="Inversión total" value={f.automationInvestment} onChange={set('automationInvestment')} unit="$" step={5000} />
            <NumInput label="Mantenimiento anual" value={f.maintenancePct} onChange={set('maintenancePct')} unit="%" step={0.5} hint="% sobre la inversión" />
            <NumInput label="Ganancia de eficiencia laboral" value={f.efficiencyGain} onChange={set('efficiencyGain')} unit="%" step={5} hint="% reducción en mano de obra" />
          </div>
        </div>

        {/* ── Results ── */}
        <div className="nds-tool-results">
          <div className="nds-roi-kpi-grid">
            <KpiCard label="ROI" value={fmtPct(calc.roi)} accent />
            <KpiCard label="Recuperación" value={paybackLabel} />
            <KpiCard label="Ahorro anual" value={fmt(calc.annualSavings)} />
            <KpiCard label="Beneficio neto 5 años" value={fmt(calc.fiveYearNetBenefit)} sub={calc.fiveYearNetBenefit > 0 ? 'Positivo' : 'Negativo'} />
          </div>

          <div className="nds-roi-breakdown">
            <h3 className="nds-roi-breakdown-title">Costos actuales anuales</h3>
            <div className="nds-roi-row">
              <span>Mano de obra</span>
              <span>{fmt(calc.laborCost)}</span>
            </div>
            <div className="nds-roi-row">
              <span>Pérdida por defectos</span>
              <span>{fmt(calc.defectLoss)}</span>
            </div>
            <div className="nds-roi-row">
              <span>Costo de tiempo muerto</span>
              <span>{fmt(calc.downtimeLoss)}</span>
            </div>
            <div className="nds-roi-row nds-roi-row--total">
              <span>Total anual actual</span>
              <span>{fmt(calc.totalCurrentCost)}</span>
            </div>
          </div>

          <div className="nds-roi-breakdown">
            <h3 className="nds-roi-breakdown-title">Ahorros con automatización</h3>
            <div className="nds-roi-row nds-roi-row--save">
              <span>Reducción laboral</span>
              <span>+{fmt(calc.automationLaborSavings)}</span>
            </div>
            <div className="nds-roi-row nds-roi-row--save">
              <span>Reducción de defectos (85%)</span>
              <span>+{fmt(calc.automationDefectReduction)}</span>
            </div>
            <div className="nds-roi-row nds-roi-row--save">
              <span>Reducción de tiempo muerto (70%)</span>
              <span>+{fmt(calc.automationDowntimeReduction)}</span>
            </div>
            <div className="nds-roi-row nds-roi-row--cost">
              <span>Mantenimiento anual</span>
              <span>−{fmt(calc.annualMaintenanceCost)}</span>
            </div>
            <div className="nds-roi-row nds-roi-row--total">
              <span>Ahorro neto anual</span>
              <span>{fmt(calc.annualSavings)}</span>
            </div>
          </div>

          <p className="nds-tool-disclaimer">
            Estimaciones orientativas. Los resultados reales dependen de la implementación específica, el tipo de proceso y las condiciones de operación.
          </p>
        </div>
      </div>
    </PortalLayout>
  )
}
