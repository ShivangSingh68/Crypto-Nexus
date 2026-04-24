import SignInFormClient from "@/modules/auth/components/sign-in-form-client";
import Image from "next/image";
import React from "react";

const Page = () => {
    return (
        <>
        <Image src={"/login.svg"} alt= "Login-Image" height={300} width={300} className="m-6 object-cover" />
        <SignInFormClient/>
        </>
    )
}

export default Page;


// 'use client';

// import Link from 'next/link';
// import { useState } from 'react';

// export default function SignInPage() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async () => {
//     setLoading(true);
//     await new Promise((r) => setTimeout(r, 1000));
//     setLoading(false);
//   };

//   return (
//     <div className="card-glass-strong rounded-3xl p-8">
//       {/* Logo */}
//       <div className="text-center mb-8">
//         <div className="inline-flex items-center gap-2 mb-4">
//           <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00f5ff] to-[#cba6f7] flex items-center justify-center glow-cyan">
//             <span className="text-[#0d0b14] font-orbitron font-black">N</span>
//           </div>
//           <span className="font-orbitron font-bold text-base tracking-widest uppercase text-[#00f5ff] text-glow-cyan">
//             Crypto<span className="text-[#cba6f7]">Nexus</span>
//           </span>
//         </div>
//         <h1 className="font-orbitron font-bold text-xl uppercase tracking-wider text-[#cdd6f4] mb-1">
//           Welcome Back
//         </h1>
//         <p className="font-rajdhani text-sm text-[#585b70]">Sign in to your trading account</p>
//       </div>

//       {/* Form */}
//       <div className="flex flex-col gap-4 mb-6">
//         <div>
//           <label className="font-rajdhani text-xs uppercase tracking-wider text-[#585b70] mb-1.5 block">Email</label>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="trader@nexus.gg"
//             className="nexus-input w-full px-4 py-3 text-sm"
//           />
//         </div>
//         <div>
//           <label className="font-rajdhani text-xs uppercase tracking-wider text-[#585b70] mb-1.5 block">Password</label>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="••••••••"
//             className="nexus-input w-full px-4 py-3 text-sm"
//           />
//         </div>
//       </div>

//       <button
//         onClick={handleSubmit}
//         disabled={loading}
//         className="neon-btn-cyan w-full py-3 rounded-xl font-orbitron font-bold text-sm tracking-widest uppercase glow-cyan disabled:opacity-60"
//       >
//         {loading ? (
//           <span className="flex items-center justify-center gap-2">
//             <span className="w-4 h-4 border-2 border-t-transparent border-[#00f5ff] rounded-full animate-spin" />
//             Authenticating...
//           </span>
//         ) : (
//           'Sign In →'
//         )}
//       </button>

//       <div className="flex items-center gap-3 my-5">
//         <div className="flex-1 h-px bg-[rgba(180,190,254,0.1)]" />
//         <span className="font-rajdhani text-xs text-[#45475a]">or</span>
//         <div className="flex-1 h-px bg-[rgba(180,190,254,0.1)]" />
//       </div>

//       {/* Social/Guest */}
//       <button className="neon-btn-mauve w-full py-3 rounded-xl font-orbitron font-bold text-sm tracking-widest uppercase mb-3">
//         Continue as Guest
//       </button>

//       <p className="text-center font-rajdhani text-sm text-[#585b70]">
//         New to Nexus?{' '}
//         <Link href="#" className="text-[#00f5ff] hover:underline">
//           Create Account
//         </Link>
//       </p>

//       <p className="text-center font-mono-tech text-[10px] text-[#313148] mt-4">
//         NO REAL MONEY · VIRTUAL TRADING ONLY
//       </p>
//     </div>
//   );
// }