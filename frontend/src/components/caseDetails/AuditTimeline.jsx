import AuditEvent from "./AuditEvent";

const AuditTimeline = ({ events }) => {
  return (
    <div className="relative">

      {/* Vertical Timeline Line */}

      <div className="absolute left-7 top-0 bottom-0 w-0.5 bg-slate-700" />

      <div className="space-y-8">

        {events.map((event, index) => (
          <AuditEvent
            key={event._id || index}
            event={event}
            isLast={index === events.length - 1}
          />
        ))}

      </div>

    </div>
  );
};

export default AuditTimeline;