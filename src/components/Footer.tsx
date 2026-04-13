export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 mt-auto bg-white">
      <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <h3 className="text-lg font-bold text-neutral-900 tracking-tight">HeyHighToolz</h3>
            <p className="text-sm text-neutral-500 mt-3 max-w-sm leading-relaxed">
              Premium digital tools and subscriptions delivered instantly. Secure crypto payments accepted.
            </p>
            <a href="mailto:heyhightoolz@gmail.com" className="text-sm text-neutral-500 hover:text-neutral-900 transition mt-2 inline-block">
              heyhightoolz@gmail.com
            </a>
            {/* Social */}
            <div className="flex items-center gap-3 mt-4">
              <a
                href="https://www.tiktok.com/@heyhightoolz"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-neutral-100 hover:bg-neutral-200 rounded-lg flex items-center justify-center transition"
                aria-label="TikTok"
              >
                <svg className="w-4 h-4 text-neutral-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46v-7.15a8.16 8.16 0 005.58 2.17v-3.4a4.85 4.85 0 01-1-.1z" />
                </svg>
              </a>
              <a
                href="https://api.whatsapp.com/send/?phone=2347067830318&text=Hello!&type=phone_number&app_absent=0"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-neutral-100 hover:bg-neutral-200 rounded-lg flex items-center justify-center transition"
                aria-label="WhatsApp"
              >
                <svg className="w-4 h-4 text-neutral-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-4">Navigate</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="/" className="text-neutral-600 hover:text-neutral-900 transition">Home</a></li>
              <li><a href="/shop" className="text-neutral-600 hover:text-neutral-900 transition">Shop</a></li>
              <li><a href="/cart" className="text-neutral-600 hover:text-neutral-900 transition">Cart</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-4">Payment</h4>
            <div className="flex flex-wrap gap-2">
              {["BTC", "ETH", "USDT", "SOL", "LTC", "USDC"].map((coin) => (
                <span key={coin} className="text-xs bg-neutral-100 text-neutral-600 px-2.5 py-1 rounded-md font-mono">
                  {coin}
                </span>
              ))}
            </div>
            <p className="text-xs text-neutral-400 mt-3">Powered by InventPay</p>
          </div>
        </div>
        <div className="border-t border-neutral-100 mt-12 pt-8 text-center text-xs text-neutral-400">
          &copy; {new Date().getFullYear()} HeyHighToolz. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
