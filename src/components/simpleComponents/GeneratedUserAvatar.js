import { minidenticon } from 'minidenticons'
import { useMemo } from 'react'

const GeneratedUserAvatar = ({ username, saturation, lightness, ...rest }) => {
  const svgURI = useMemo(
    () => 'data:image/svg+xml;utf8,' + encodeURIComponent(minidenticon(username, saturation, lightness)),
    [username, saturation, lightness]
  )
  return (<img src={svgURI} alt={username} {...rest} />)
}

export default GeneratedUserAvatar;