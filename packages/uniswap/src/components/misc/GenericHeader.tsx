import { Flex, GeneratedIcon, Text, getTokenValue, useMedia } from 'ui/src'
import { IconSizeTokens, TextVariantTokens, fonts } from 'ui/src/theme'

type GenericHeaderProps = {
  Icon?: GeneratedIcon
  iconSize?: IconSizeTokens
  title?: string
  titleVariant?: TextVariantTokens
  subtitle?: string
  subtitleVariant?: TextVariantTokens
}

/**
 * Helper component to render an icon w/ padding, title, and subtitle
 */
export function GenericHeader({
  title,
  titleVariant = 'subheading1',
  subtitle,
  subtitleVariant = 'subheading2',
  Icon,
  iconSize = '$icon.36',
}: GenericHeaderProps): JSX.Element {
  const media = useMedia()
  const showIcon = !media.short

  const iconTotalSizeValue = getTokenValue(iconSize)
  const iconPadding = iconTotalSizeValue / 4
  const iconSizeValue = iconTotalSizeValue / 2

  return (
    <Flex centered gap="$spacing8" m="$spacing12">
      {showIcon && Icon && (
        <Flex centered mb="$spacing4">
          <Flex centered backgroundColor="$surface3" borderRadius="$rounded8" p={iconPadding}>
            <Icon color="$neutral1" size={iconSizeValue} />
          </Flex>
        </Flex>
      )}
      {title && (
        <Text textAlign="center" variant={titleVariant}>
          {title}
        </Text>
      )}
      {subtitle && (
        <Text
          $short={{ variant: 'body3' }}
          color="$neutral2"
          maxFontSizeMultiplier={media.short ? 1.1 : fonts.body2.maxFontSizeMultiplier}
          textAlign="center"
          variant={subtitleVariant}
        >
          {subtitle}
        </Text>
      )}
    </Flex>
  )
}
