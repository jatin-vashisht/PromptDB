'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'

import Profile from '@components/Profile'

const MyProfile = ({params}) => {
  const router = useRouter()
  const searchParams = useSearchParams();
  const name = searchParams.get("name");

  const [posts, setPosts] = useState([])
  const {data: session} = useSession()

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch(`/api/users/${params.id}/posts`,{
        cache: 'no-store'
      })
      const data = await res.json()
      
      setPosts(data)
    }

    session?.user.id && fetchPosts()
  }, [session?.user.id])

  const handleEdit = (post) => {
    router.push(`/update-prompt?id=${post._id}`);
  };
  const handleDelete = async (post) => { 
    const hasConfirmed = confirm("Are you sure you want to delete the prompt?")

    if (hasConfirmed) {
      try {
        await fetch(`/api/prompt/${post._id, toString()}`, {
          method: 'DELETE'
        })

        const filteredPosts = posts.filter(p => p._id !== post._id)
        setPosts(filteredPosts)
      } catch (error) {
        console.log(error)
      }
    }
  }
  return (
    <Profile
      name={session?.user.id === params.id ? "My" : name}
      desc={session?.user.id === params.id? "Welcome to your personalized profile page." : `Welcome to ${name}'s personalized profile page. Explore ${name}'s exceptional prompts and be inspired by the power of their imagination.`}
      data={posts}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
      promptId={params.id}
    />
  )
}

export default MyProfile