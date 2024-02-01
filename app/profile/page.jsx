'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

import Profile from '@components/Profile'

const MyProfile = () => {
  const router = useRouter()

  const [posts, setPosts] = useState([])
  const {data: session} = useSession()

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch(`${process.env.HOST}/api/users/${session?.user.id}/posts`,{
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
        await fetch(`${process.env.HOST}/api/prompt/${post._id, toString()}`, {
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
      name="My"
      desc="Welcome to your personalized profile page"
      data={posts}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  )
}

export default MyProfile