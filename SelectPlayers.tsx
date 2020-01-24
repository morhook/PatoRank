import R from 'ramda'
import React, { useState } from 'react'
import { Text, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import { PlayerData } from './ranking'
import PlayerBox from './PlayerBox'
import RoundedButton from './RoundedButton'
import { NavigationStackScreenProps } from 'react-navigation-stack'

interface SelectPlayersProps {
  players: PlayerData[]
  selectedIds: string[]
  onTap: (item: PlayerData) => void
}

const SelectPlayers: React.FC<SelectPlayersProps> = ({
  players,
  selectedIds,
  onTap
}) => {
  return (
    <ScrollView
      style={{
        flex: 1,
        margin: 0
      }}
    >
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-evenly'
        }}
      >
        {players.map(item => (
          <PlayerBox
            key={item.id}
            player={item}
            onTap={() => onTap(item)}
            selected={selectedIds.indexOf(item.id) + 1}
            selectedCount={selectedIds.length}
          />
        ))}
      </View>
    </ScrollView>
  )
}

function SelectPlayersAndContinue({
  navigation,
  ...props
}: SelectPlayersProps & NavigationStackScreenProps) {
  const { players, selectedIds } = props
  const enableContinue = selectedIds.length > 1
  return (
    <View style={{ flex: 1, backgroundColor: 'black' }}>
      <SelectPlayers {...props} />
      <SafeAreaView style={{ paddingTop: 0 }}>
        <RoundedButton
          underlayColor="#0A5B4A"
          enabled={enableContinue}
          style={{
            backgroundColor: '#14B795'
          }}
          onPress={() =>
            navigation.push('AddMatch', {
              players: selectedIds.map(id => players.find(p => p.id === id))
            })
          }
        >
          <Text
            style={{
              color: enableContinue ? 'white' : '#ffffff80',
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: 20
            }}
          >
            Continuar
          </Text>
        </RoundedButton>
      </SafeAreaView>
    </View>
  )
}

function toggle(
  id: string,
  selected: string[],
  setSelected: (s: string[]) => void
) {
  setSelected(
    selected.indexOf(id) >= 0
      ? R.filter((x: string) => id !== x, selected)
      : selected.length < 4
      ? R.append(id, selected)
      : selected
  )
}

export default function SelectPlayersScreen(props: NavigationStackScreenProps) {
  const [selected, setSelected] = useState([] as string[])
  return (
    <SelectPlayersAndContinue
      {...props}
      players={props.navigation.getParam('players')}
      selectedIds={selected}
      onTap={item => toggle(item.id, selected, setSelected)}
    />
  )
}
SelectPlayersScreen.navigationOptions = {
  title: '¿Quiénes juegan?'
}
