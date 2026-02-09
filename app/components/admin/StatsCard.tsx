interface StatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  bgColor: string;
  iconColor: string;
}

export function StatsCard({ icon, label, value, bgColor, iconColor }: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center`}>
          <div className={iconColor}>{icon}</div>
        </div>
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}
