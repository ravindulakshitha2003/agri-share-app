import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import TheamView from '../../components/TheamView'
import ThemaText from '../../components/ThemaText'
import ThemedInput from '../../components/ThemedInput'

const sellers = () => {
  return (
    <TheamView safe={true}  >
             
        <ThemaText > published your Goods </ThemaText>

              {/* this area reseved for the  somoe details   */}
        <TheamView>

        </TheamView>
            <ThemedInput label={"good category"}>

            </ThemedInput>

              {/* this area reseved for the add the good  */}
        <TheamView>

        </TheamView>
              {/* this area reseved for the add the buttons  */}
        <TheamView>

        </TheamView>





    </TheamView>
  )
}

export default sellers

const styles = StyleSheet.create({})