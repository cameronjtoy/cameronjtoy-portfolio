// One rail car per BNSF resume highlight, in the same order as
// `resume.experience[bnsf].highlights`. The metric is the headline number
// from that highlight.
export const cars = [
  { kind: 'hopper', metric: '$1M+', label: 'saved with demand forecasting' },
  { kind: 'well', metric: '~150', label: 'apps on one CRUD framework' },
  { kind: 'box', metric: '98%', label: 'attrition record accuracy' },
  { kind: 'flat', metric: '100+', label: 'stations in demand metrics' },
  { kind: 'tank', metric: 'EDI 404', label: 'waybill tests over MQ and Kafka' },
] as const
