<template>
  <div class="home">
    Useful tool for work
  </div>
</template>

<script>
// @ is an alias to /src
import axios from 'axios'
export default {
  name: 'Home',
  mounted () {
    axios.post('https://dapp851951875.functionx.io/testnet/apiBlockExplorer/chainConfig/getChainConfig', {
    }).then(val => {
      console.log('val', val);
    })
  }
}
</script>
