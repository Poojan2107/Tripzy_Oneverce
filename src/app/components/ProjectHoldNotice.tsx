import React from "react";

export default function ProjectHoldNotice() {
  const contacts = [
    {
      name: "VANSH PRAJAPATI",
      role: "Director of Project Delivery & Operations",
      phoneDisplay: "+91 84012 86822",
      phoneRaw: "+918401286822",
      whatsapp: "918401286822",
      initials: "VP",
      gradient: "from-amber-400 via-orange-500 to-amber-600",
    },
    {
      name: "POOJAN SHRIVASTAV",
      role: "Chief Technical Architect & Lead Engineer",
      phoneDisplay: "+91 90233 62134",
      phoneRaw: "+919023362134",
      whatsapp: "919023362134",
      initials: "PS",
      gradient: "from-cyan-400 via-blue-500 to-indigo-600",
    },
  ];

  return (
    <div className="absolute inset-0 z-50 overflow-y-auto overflow-x-hidden bg-black/45 backdrop-blur-[3px] flex items-center justify-center p-3 sm:p-6 lg:p-8 font-sans selection:bg-amber-500 selection:text-black">
      
      {/* Ambient lighting glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] sm:w-[900px] h-[500px] bg-amber-500/10 rounded-full blur-[140px]" />
      </div>

      {/* Main Luxury Glass Card */}
      <div className="relative w-full max-w-3xl bg-[#090e1cf2] border border-amber-500/30 rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.9)] p-5 sm:p-8 lg:p-9 backdrop-blur-2xl my-auto text-slate-100 ring-1 ring-white/15">
        
        {/* Top Header Bar & Developer Badge */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider shadow-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
              </span>
              <span>Official Notice &bull; Access Paused</span>
            </div>

            <div className="mt-2.5 flex items-center gap-2">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Built By:</span>
              <span className="text-sm font-black text-amber-400 tracking-wider bg-slate-900/90 px-3 py-1 rounded-lg border border-slate-800 shadow-sm">
                ONEVERCE SOLUTIONS
              </span>
            </div>
          </div>

          <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-inner shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-7 h-7 sm:w-8 sm:h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
          </div>
        </div>

        {/* Natural, Meaningful Headline & Explanation */}
        <div className="mt-5 space-y-3.5">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-snug">
            This project has been paused until the final payment is completed.
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Our developer team at <strong className="text-white font-semibold">ONEVERCE SOLUTIONS</strong> worked continuous days and nights putting in genuine dedication, hard work, and technical effort to design, build, test, and complete this project.
          </p>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Live access to this website is currently <strong className="text-amber-300 font-semibold">placed on hold</strong> because the agreed payment for our development work has not yet been paid by the client.
          </p>

          {/* Secure Custody Box */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 sm:p-5 mt-4 shadow-inner">
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                </svg>
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">Project Safety &amp; Immediate Reopening</h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
                  The complete source code, database, design assets, and live deployment are safely preserved in our developers' hands. As soon as the pending payment is completed and client handover procedures are finished, the website will be turned on immediately.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3-Step Handover Progress */}
        <div className="mt-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-2">
            <span>Current Status &amp; Unlock Steps</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Step 1 */}
            <div className="bg-slate-950/70 border border-emerald-500/40 p-3.5 sm:p-4 rounded-2xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Step 01</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  Completed ✓
                </span>
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-white">Development Work</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Full project completed with days &amp; nights of hard work by ONEVERCE SOLUTIONS.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-amber-500/10 border border-amber-500/50 p-3.5 sm:p-4 rounded-2xl relative overflow-hidden shadow-lg shadow-amber-500/5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">Step 02</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                  Awaiting Payment ⏳
                </span>
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-white">Client Payment</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Waiting for the client to clear the agreed payment to reopen the project.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-950/70 border border-slate-800 p-3.5 sm:p-4 rounded-2xl opacity-80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Step 03</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                  Ready to Unlock 🔒
                </span>
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-300">Website Handover</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Full ownership, domain, and live access will be unlocked instantly.
              </p>
            </div>
          </div>
        </div>

        {/* Direct Leadership Contacts */}
        <div className="mt-6 pt-5 border-t border-slate-800">
          <div className="mb-3.5">
            <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5 text-amber-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
              </svg>
              Contact our team directly to complete payment and unlock the website
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              You can reach the ONEVERCE SOLUTIONS team directly via Call or WhatsApp.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {contacts.map((contact) => (
              <div 
                key={contact.name}
                className="group bg-slate-950/85 border border-slate-800 hover:border-slate-700 p-4 rounded-2xl flex flex-col justify-between transition-all shadow-md"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${contact.gradient} flex items-center justify-center text-white font-black text-sm shadow-md`}>
                      {contact.initials}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-white tracking-wide">{contact.name}</h3>
                      <p className="text-xs font-medium text-slate-400 leading-snug">{contact.role}</p>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-800/80">
                    <div className="text-xs sm:text-sm font-mono font-bold text-slate-200">
                      {contact.phoneDisplay}
                    </div>
                  </div>
                </div>

                {/* Call and WhatsApp Action Buttons */}
                <div className="mt-3.5 grid grid-cols-2 gap-2">
                  <a
                    href={`tel:${contact.phoneRaw}`}
                    className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors border border-slate-700 shadow-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-slate-300">
                      <path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 0 1 3.5 2h1.148a1.5 1.5 0 0 1 1.484 1.272l.462 2.772a1.5 1.5 0 0 1-.72 1.55l-1.077.646a11.042 11.042 0 0 0 5.485 5.485l.646-1.077a1.5 1.5 0 0 1 1.55-.72l2.772.462A1.5 1.5 0 0 1 18 15.352V16.5a1.5 1.5 0 0 1-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 0 1 2.43 8.326 13.019 13.019 0 0 1 2 5V3.5Z" clipRule="evenodd" />
                    </svg>
                    <span>Direct Call</span>
                  </a>

                  <a
                    href={`https://wa.me/${contact.whatsapp}?text=Hello%20${encodeURIComponent(contact.name)},%20regarding%20the%20pending%20project%20payment%20and%20reactivation.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-md shadow-emerald-950/40"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                    </svg>
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3.5 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <span>&copy; ONEVERCE SOLUTIONS &bull; Official Developer Notice</span>
          <span>Source code &amp; live deployment keys held securely pending payment clearance</span>
        </div>

      </div>
    </div>
  );
}
