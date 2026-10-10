import { makeBeats } from '../../engine/beats'

// Four beats, one per highlight across the two earlier roles:
// 0 Develop for Good: the MVP is deployed and images land in storage
// 1 Develop for Good: sign-in links verify users
// 2 University at Buffalo: the data profiler's histogram assembles
// 3 University at Buffalo: the chart renders faster

export const BEATS = 4
export const { activeBeat, beatProgress } = makeBeats(BEATS)

// Headline numbers per entry, in highlight order.
export const metrics = [
  [
    { metric: 'EC2 + S3', label: 'MVP deployed on AWS' },
    { metric: '500+', label: 'users verified without passwords' },
  ],
  [
    { metric: '20%', label: 'less processing time' },
    { metric: '25%', label: 'less rendering time' },
  ],
] as const
