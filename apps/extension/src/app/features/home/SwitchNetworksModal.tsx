import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useDappContext } from 'src/app/features/dapp/DappContext'
import { removeDappConnection, saveDappChain } from 'src/app/features/dapp/actions'
import { useDappLastChainId } from 'src/app/features/dapp/hooks'
import { PopupName, closePopup } from 'src/app/features/popups/slice'
import { Anchor, Button, Flex, Popover, Separator, Text, TouchableArea } from 'ui/src'
import { Check, Power } from 'ui/src/components/icons'
import { usePreventOverflowBelowFold } from 'ui/src/hooks/usePreventOverflowBelowFold'
import { iconSizes } from 'ui/src/theme'
import { NetworkLogo } from 'uniswap/src/components/CurrencyLogo/NetworkLogo'
import { useEnabledChains } from 'uniswap/src/features/chains/hooks/useEnabledChains'
import { UniverseChainId } from 'uniswap/src/features/chains/types'
import { getChainLabel } from 'uniswap/src/features/chains/utils'
import { pushNotification } from 'uniswap/src/features/notifications/slice'
import { AppNotificationType } from 'uniswap/src/features/notifications/types'
import { ExtensionEventName } from 'uniswap/src/features/telemetry/constants'
import { sendAnalyticsEvent } from 'uniswap/src/features/telemetry/send'
import { extractUrlHost } from 'utilities/src/format/urls'
import { useActiveAccountWithThrow } from 'wallet/src/features/wallet/hooks'

const BUTTON_OFFSET = 20

export function SwitchNetworksModal(): JSX.Element {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { dappUrl, dappIconUrl } = useDappContext()
  const activeWalletAccount = useActiveAccountWithThrow()
  const activeChain = useDappLastChainId(dappUrl)
  const { chains: enabledChains } = useEnabledChains()

  const onNetworkClicked = async (chainId: UniverseChainId): Promise<void> => {
    await saveDappChain(dappUrl, chainId)
    sendAnalyticsEvent(ExtensionEventName.SidebarSwitchChain, {
      previousChainId: activeChain,
      newChainId: chainId,
    })
  }

  const onDisconnect = async (): Promise<void> => {
    await removeDappConnection(dappUrl, activeWalletAccount)
    dispatch(pushNotification({ type: AppNotificationType.DappDisconnected, dappIconUrl }))
    dispatch(closePopup(PopupName.Connect))
    sendAnalyticsEvent(ExtensionEventName.SidebarDisconnect)
  }

  const { ref, maxHeight } = usePreventOverflowBelowFold()

  return (
    <Flex
      ref={ref}
      alignContent="center"
      // TODO:  update background color to blurry scrim when available
      backgroundColor="$surface1"
      borderRadius="$rounded24"
      pt="$spacing8"
      width={220}
      maxHeight={maxHeight - BUTTON_OFFSET}
    >
      <Flex px="$spacing8">
        <Text variant="subheading2">{t('extension.connection.titleConnected')}</Text>
        {dappUrl ? (
          <Anchor color="$accent1" href={dappUrl} textDecorationLine="none">
            <Flex>
              <Text color="$accent1" numberOfLines={1} variant="buttonLabel2">
                {extractUrlHost(dappUrl)}
              </Text>
            </Flex>
          </Anchor>
        ) : null}
      </Flex>

      <Separator mb="$spacing4" mt="$spacing8" />

      <Flex shrink $platform-web={{ overflow: 'auto' }}>
        {enabledChains.map((chain: UniverseChainId) => {
          return (
            <Popover.Close asChild>
              {/* TODO(WALL-5883): Use new component */}
              <TouchableArea
                key={chain}
                borderRadius="$rounded12"
                hoverStyle={{ backgroundColor: '$surface2' }}
                justifyContent="space-between"
                p="$spacing8"
                onPress={async (): Promise<void> => onNetworkClicked(chain)}
              >
                <Flex grow row alignItems="center" justifyContent="space-between">
                  <Flex grow row alignItems="center" gap="$spacing8">
                    <NetworkLogo chainId={chain} size={iconSizes.icon20} />
                    <Text color="$neutral1" variant="subheading2">
                      {getChainLabel(chain)}
                    </Text>
                  </Flex>
                  {activeChain === chain ? (
                    <Flex row>
                      <Check color="$neutral2" size={iconSizes.icon20} />
                    </Flex>
                  ) : null}
                </Flex>
              </TouchableArea>
            </Popover.Close>
          )
        })}
      </Flex>

      <Popover.Close asChild>
        <Flex row>
          <Button icon={<Power />} mt="$spacing8" size="small" emphasis="secondary" onPress={onDisconnect}>
            {t('common.button.disconnect')}
          </Button>
        </Flex>
      </Popover.Close>
    </Flex>
  )
}
