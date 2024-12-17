import React, { useEffect, useState } from 'react'
import WebSidebar from './WebSidebar'
import WebProfile from './WebProfile'
import WebSkills from './WebSkills'
import WebProject from './WebProject'
import WebExperience from './WebExperience'
import WebTestimonial from './WebTestimonial'
import WebLoader from './WebLoader'
import WebBlogs from './WebBlogs'
import WebContact from './WebContact'

const WebLayout = () => {

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false)
        }, 2000)

        return () => clearTimeout(timer)
    }, [])


    return (
        <>
            {loading ? (<WebLoader />) : (
                <div className="flex">
                    <WebSidebar />
                    <div className="flex-1 overflow-hidden p-6">
                        <WebProfile />
                        <WebSkills />
                        <WebExperience />
                        <WebProject />
                        <WebTestimonial />
                        <WebBlogs/>
                        <WebContact/>
                    </div>
                </div>
            )}
        </>
    )
}

export default WebLayout
