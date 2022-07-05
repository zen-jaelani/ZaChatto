import { useRouter } from 'next/router'
import React, { FormEvent } from 'react'

type Props = {}

export default function Login({}: Props) {
    const router = useRouter()

    function handleSubmit(e:FormEvent) {
        e.preventDefault()
        router.push("/")
    }
  return (
    <div className="flex bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 min-h-screen">
        <div className='bg-slate-800 w-1/2 m-auto text-white py-5 rounded-md' >
            <h1 className='text-center text-3xl font-bold mb-5'>Login</h1>
            <hr />
            <form className="px-5 my-10" onSubmit={e=>handleSubmit(e)}>
                <input type="email" className='bg-slate-800 border-b-2 w-full text-white mb-10 p-3' placeholder='Email' />
                <input type="password" className='bg-slate-800 border-b-2 w-full text-white mb-10 p-3' placeholder='Password' />
                <button className='w-full bg-violet-900 p-4 rounded-xl'>Login</button>
            </form>
        </div>
    </div>
  )
}