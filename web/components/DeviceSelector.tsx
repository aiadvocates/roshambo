import { getMediaDevices } from "~/util/helpers"
import React, { useState, useEffect, useRef } from 'react';

interface DeviceProps {
  onSelect(id: any): any 
}

export const DeviceSelector = ({onSelect}: DeviceProps) => {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([])
  const selectEl = useRef(null)

  const selectDevice = () => onSelect(selectEl.current.value)
  
  useEffect(() => {
    (async () => {
      const d = await getMediaDevices()
      setDevices(d)
    })()
  })

  return (
    <select ref={selectEl} title="Select Video Camera" onInput={selectDevice}>
      {devices.map(d => (<option key={d.deviceId} value={d.deviceId}>{d.label}</option>))}
    </select>
  )
}

export default DeviceSelector