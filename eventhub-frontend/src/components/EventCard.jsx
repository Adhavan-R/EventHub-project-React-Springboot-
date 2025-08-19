import { Link } from "react-router-dom";

const EventCard = ({ event }) => {
  const bannerSrc = event.bannerUrl
    ? `http://localhost:8080${event.bannerUrl}`
    : null;

  return (
   <div className="bg-white/90 backdrop-blur-sm shadow-lg rounded-2xl p-6 transition transform hover:scale-[1.02] hover:shadow-xl border border-gray-200">
  <Link to={`/events/${event.id}`} className="block">
    {bannerSrc ? (
      <img
        src={bannerSrc}
        alt="Event banner"
        className="w-full h-48 object-cover rounded-t-2xl mb-4 shadow-sm"
      />
    ) : (
      <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-t-2xl mb-4 text-gray-500 font-semibold select-none shadow-inner">
        <span>No Banner</span>
      </div>
    )}
    <h2 className="text-2xl font-extrabold text-purple-700 hover:text-purple-900 hover:underline transition-colors mb-2 select-none">
      {event.title}
    </h2>

    <span className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold uppercase tracking-wider rounded-full px-3 py-1 mb-4 select-none shadow-md">
      {event.category}
    </span>

  </Link>
  
  <p className="text-gray-700 leading-relaxed mb-3">
    {event.description?.slice(0, 100)}...
  </p>
  <p className="text-sm text-gray-500 mt-auto select-none">
    {new Date(event.date).toLocaleString()}
  </p>
</div>

  );
};

export default EventCard;
