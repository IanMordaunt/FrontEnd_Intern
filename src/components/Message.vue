<template>
    <h1>{{ msg }}
</template>

<script>
export default {
   props: ["msg"],

   mounted() {
       console.log(mounted)
   }
};
</script>
