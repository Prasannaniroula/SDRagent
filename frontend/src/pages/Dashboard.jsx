import React from 'react'
import{useState, useEffect} from 'react'
import axios from 'axios'

function Dashboard() {
  const [metrics, setMetrics] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(()=>{
    axios.get('${import.meta.env.VITE_API_URL}/metrics')
    .then(res=>{
      setMetrics(res.data)
      setLoading(false)
    })
    .catch(err=>{
      console.log(err)
      setLoading(false)
    })
  },[])

  return (
    <div>Dashboard</div>
  )
}

export default Dashboard