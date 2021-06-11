import { getMediaDevices } from "~/util/helpers"
import React, { useState, useEffect } from 'react';


export const DeviceSelector = () => {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([])
  
  useEffect(() => {
    getMediaDevices().then(
      m => setDevices(m)
    )
  })

  return (
    <select>
      {devices.map(d => (<option value={d.deviceId}>{d.label}</option>))}
    </select>
  )
}

export default DeviceSelector