import toast from "react-hot-toast";
import WhatsappIcon from '../Icons/WhatsappIcon';

export function ShareMenu({ link, title,onClose }: { link: string; title: string,onClose: ()=>void }) {
  const encodedLink = encodeURIComponent(link);
  const encodedTitle = encodeURIComponent(title);

  const shareOptions = [
    {
      label: "WhatsApp",
      icon: <WhatsappIcon/>,
      url: `https://wa.me/?text=${encodedTitle}%20${encodedLink}`,
    },
    {
      label: "Telegram",
      icon: <WhatsappIcon/>,
      url: `https://t.me/share/url?url=${encodedLink}&text=${encodedTitle}`,
    },
    {
      label: "Instagram",
      icon: <WhatsappIcon/>,
      url: `https://www.instagram.com`, // No direct share API; open app
      disabled: true,
    },
    {
      label: "Copy Link",
      icon: <WhatsappIcon/>,
      onClick: () => {
        navigator.clipboard.writeText(link);
        toast.success("Link copied to clipboard!");
      },
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white p-6 rounded-xl shadow-lg w-80 grid grid-cols-2 gap-4 relative"
        onClick={(e) => e.stopPropagation()} // prevents click bubbling
      >
        <button className="absolute top-2 right-2 text-gray-500 hover:text-red-500" onClick={onClose}>✕</button>
        {shareOptions.map((opt, i) => (
          <div key={i} className="flex flex-col items-center text-center cursor-pointer">
            {opt.onClick ? (
              <div onClick={opt.onClick}>
                {opt.icon}
                <p className="text-sm mt-1">{opt.label}</p>
              </div>
            ) : (
              <a
                href={opt.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`hover:scale-105 transition-transform ${opt.disabled ? "opacity-50 pointer-events-none" : ""}`}
              >
                {opt.icon}
                <p className="text-sm mt-1">{opt.label}</p>
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

