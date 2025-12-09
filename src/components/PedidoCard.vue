<template>
<div class="rounded-xl p-5 shadow-lg border border-gray-200 bg-white">
<div class="flex justify-between items-start">
<div>
<h3 class="font-semibold text-[#0B1A33]">Pedido #{{ pedido.id }}</h3>
<p class="text-gray-500 text-sm">{{ pedido.data }}</p>
</div>
<span class="text-green-600 bg-green-100 px-3 py-1 rounded-full text-xs font-medium">Aprovado</span>
</div>


<div class="mt-4 space-y-4">
<div
v-for="item in pedido.itens"
:key="item.nome"
class="flex items-center gap-3"
>
<img :src="item.img" class="w-12 h-12 rounded-lg object-cover shadow-sm" />
<div class="flex-1">
<p class="font-medium text-sm text-[#0B1A33]">{{ item.nome }}</p>
<p class="text-gray-500 text-xs">R$ {{ item.valor }}</p>
</div>
</div>
</div>


<div class="mt-4 pt-4 border-t flex justify-between font-semibold text-[#0B1A33]">
<span>Total da compra</span>
<span>R$ {{ pedido.total }}</span>
</div>


<button
@click="emit('abrir', pedido)"
class="mt-4 w-full bg-[#0B1A33] text-white py-2 rounded-lg hover:bg-[#112544] transition"
>
Ver detalhes
</button>
</div>
</template>


<script setup>
const props = defineProps({
pedido: { type: Object, required: true }
});
const emit = defineEmits(["abrir"]);
</script>


<style scoped>
</style>