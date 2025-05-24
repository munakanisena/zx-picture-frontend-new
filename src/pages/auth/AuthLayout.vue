<template>
  <n-layout>
    <div style="position: fixed; width: 100%; height: 100%;background: 	rgba(192, 192, 192,70%) url(/src/image/banner.jpg);background-blend-mode: hue">
    </div>

    <div style="margin: 50px auto;width: min(400px,calc(100% - 16px))">
      <n-h1 style="text-align: center; font-size: 40px; color: #ffffff; filter: drop-shadow(0.05em 0.05em black)"> 惠眸图界 </n-h1>
      <router-view/>
    </div>
  </n-layout>
</template>
