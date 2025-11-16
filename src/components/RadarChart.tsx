import { Radar, RadarChart as RechartsRadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface RadarChartProps {
  scores: {
    innovation: number;
    feasibility: number;
    scalability: number;
  };
}

export function RadarChart({ scores }: RadarChartProps) {
  const data = [
    {
      subject: 'Innovation',
      score: scores.innovation,
      fullMark: 10,
    },
    {
      subject: 'Feasibility',
      score: scores.feasibility,
      fullMark: 10,
    },
    {
      subject: 'Scalability',
      score: scores.scalability,
      fullMark: 10,
    },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsRadarChart data={data}>
        <PolarGrid stroke="rgba(255,255,255,0.2)" />
        <PolarAngleAxis 
          dataKey="subject" 
          tick={{ fill: '#f8fafc', fontSize: 14, fontWeight: 600 }}
        />
        <PolarRadiusAxis 
          angle={90} 
          domain={[0, 10]} 
          tick={{ fill: '#94a3b8', fontSize: 12 }}
        />
        <Radar
          name="Scores"
          dataKey="score"
          stroke="#38bdf8"
          fill="url(#colorGradient)"
          fillOpacity={0.6}
          strokeWidth={2}
        />
        <defs>
          <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#a855f7" stopOpacity={0.8} />
          </linearGradient>
        </defs>
      </RechartsRadarChart>
    </ResponsiveContainer>
  );
}
