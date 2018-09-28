<template>
  <div id="app">
    <div>
      {{ hello }}
      <div>
        <input type="text" v-model="message">
        {{ ping }}
      </div>
      <div>
        <input type="text" v-model="label">
        <button @click="addTag">addTag!!!</button>
        add tag :{{ tag }}
      </div>
    </div>
  </div>
</template>

<script>
  import gql from 'graphql-tag'

  export default {
    name: 'app',
    apollo: {
      hello: gql`{ hello }`,
      ping: {
        query: gql`query pingMessage($message:String){
          ping(message:$message)
        }`,
        variables(){
          return {message: this.message}
        }
      }
    },
    mounted() {
      const subQuery = gql`subscription tags($label: String) {
        tagAdded(label: $label) {
          id
          label
        }
      }`

      const observer = this.$apollo.subscribe({
        query: subQuery,
        variables: {
          label: this.label,
        },
      })

      observer.subscribe({
        next(data) {
          console.log(data)
        },
        error(error) {
          console.error(error)
        },
      })
    },
    data(){
      return {
        hello: '',
        ping: '',
        message: '',
        tag: '',
        label: ''
      }
    },
    methods: {
      addTag(){
        this.$apollo.mutate({
          mutation: gql`mutation($label:String!){
          addTag(label:$label){
            id
            label
          }
        }`,
          variables: {
            label: this.label
          }
        }).then(data => {
          this.tag = data
        }).catch(err => {
          console.log(err)
        })
      }
    }
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>
