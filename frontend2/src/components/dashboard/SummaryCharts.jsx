import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { Card } from '../common/ui.jsx';

const CHART_COLOR = '#4A90A4';
const GRID_COLOR = '#37404B';
const TEXT_COLOR = '#93A0AC';

const tooltipStyle = {
  backgroundColor: '#1D2229',
  border: '1px solid #37404B',
  borderRadius: 4,
  fontFamily: '"IBM Plex Mono", monospace',
  fontSize: 12,
  color: '#EDEFF2',
};

function ChartCard({ title, subtitle, children, empty }) {
  return (
    <Card className="p-4">
      <p className="font-mono text-[11px] uppercase tracking-wider text-text-lo">{title}</p>
      {subtitle && <p className="mt-0.5 text-xs text-text-lo">{subtitle}</p>}
      <div className="mt-3" style={{ height: 220 }}>
        {empty ? (
          <div className="flex h-full items-center justify-center text-sm text-text-lo">No data yet.</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {children}
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}

export function SummaryCharts({ stats }) {
  const { connectionsOverTime = [], topUsers = [], topCountries = [], actionCounts = [], anomalyCounts = [] } =
    stats || {};

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <ChartCard
        title="Connections over time"
        subtitle="Daily connect events"
        empty={connectionsOverTime.length === 0}
      >
        <LineChart data={connectionsOverTime}>
          <CartesianGrid stroke={GRID_COLOR} strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fill: TEXT_COLOR, fontSize: 10 }} />
          <YAxis tick={{ fill: TEXT_COLOR, fontSize: 10 }} allowDecimals={false} />
          <Tooltip contentStyle={tooltipStyle} />
          <Line type="monotone" dataKey="count" stroke={CHART_COLOR} strokeWidth={2} dot={false} />
        </LineChart>
      </ChartCard>

      <ChartCard title="Top users" subtitle="By total event count" empty={topUsers.length === 0}>
        <BarChart data={topUsers} layout="vertical" margin={{ left: 24 }}>
          <CartesianGrid stroke={GRID_COLOR} strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" tick={{ fill: TEXT_COLOR, fontSize: 10 }} allowDecimals={false} />
          <YAxis dataKey="user" type="category" tick={{ fill: TEXT_COLOR, fontSize: 10 }} width={100} />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar dataKey="count" fill={CHART_COLOR} radius={[0, 2, 2, 0]} />
        </BarChart>
      </ChartCard>

      <ChartCard title="Top source countries" subtitle="GeoIP-derived, approximate" empty={topCountries.length === 0}>
        <BarChart data={topCountries}>
          <CartesianGrid stroke={GRID_COLOR} strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="country" tick={{ fill: TEXT_COLOR, fontSize: 10 }} />
          <YAxis tick={{ fill: TEXT_COLOR, fontSize: 10 }} allowDecimals={false} />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar dataKey="count" fill="#C98A3B" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ChartCard>

      <ChartCard title="Anomaly counts by type" empty={anomalyCounts.length === 0}>
        <BarChart data={anomalyCounts}>
          <CartesianGrid stroke={GRID_COLOR} strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="type" tick={{ fill: TEXT_COLOR, fontSize: 9 }} interval={0} angle={-15} textAnchor="end" height={50} />
          <YAxis tick={{ fill: TEXT_COLOR, fontSize: 10 }} allowDecimals={false} />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar dataKey="count" fill="#C1443C" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ChartCard>

      <ChartCard title="Events by action type" empty={actionCounts.length === 0}>
        <BarChart data={actionCounts}>
          <CartesianGrid stroke={GRID_COLOR} strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="action" tick={{ fill: TEXT_COLOR, fontSize: 9 }} interval={0} angle={-15} textAnchor="end" height={50} />
          <YAxis tick={{ fill: TEXT_COLOR, fontSize: 10 }} allowDecimals={false} />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar dataKey="count" fill="#4F9D69" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ChartCard>
    </div>
  );
}
