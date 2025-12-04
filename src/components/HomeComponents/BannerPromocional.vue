<template>
  <v-container fluid class="pa-0">
    <v-carousel cycle height="220" hide-delimiter-background show-arrows-on-hover>
      <v-carousel-item v-for="(b, i) in banners" :key="i">
        <v-sheet class="fill-height d-flex align-center" :style="bgStyle(b.img)">
          <v-row class="pa-8" align="center">
            <v-col cols="12" md="7">
              <h2 class="banner-title">{{ b.title }}</h2>
              <p class="banner-subtitle">{{ b.subtitle }}</p>
              <v-btn color="deep-purple accent-3" dark @click="$emit('cta', b)">Ver ofertas</v-btn>
            </v-col>
            <v-col cols="12" md="5" class="d-flex justify-end">
              <v-img v-if="b.img" :src="b.img" height="140" contain />
            </v-col>
          </v-row>
        </v-sheet>
      </v-carousel-item>
    </v-carousel>
  </v-container>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';

const props = defineProps({ 
  banners: { 
    type: Array as PropType<{ title: string; subtitle: string; img?: string }[]>, 
    default: () => [] 
  } 
});
function bgStyle(img?:string){
  if (!img) return 'background: linear-gradient(90deg,#fff2f0,#f6f4ff);';
  return `background-image: linear-gradient(90deg, rgba(255,255,255,0.8), rgba(255,255,255,0.05)), url(${img}); background-size:cover; background-position:center;`;
}
</script>

<style scoped>
.banner-title { color:#372b73; font-weight:800; margin:0 0 8px; }
.banner-subtitle { color:#555; margin:0 0 12px; }
</style>