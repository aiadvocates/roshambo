

export const getMediaDevices = async (): Promise<MediaDeviceInfo[]> => {
  if(navigator.mediaDevices) {
    const items = await navigator.mediaDevices.enumerateDevices()
    return items.filter(device => device.kind === 'videoinput')
  } else {
    return []
  }
}