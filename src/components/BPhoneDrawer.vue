<template>
<!--  Vue 3 中，未被组件 props 显式声明的属性会自动透传到组件的根元素  所以不用再在根元素 写:show props了-->
  <n-drawer width="240px" placement="left" :scrollbar-props="{trigger:'none'}">
    <n-drawer-content :native-scrollbar="false" style="margin-top: 5px" >
      <template #header>
        <div style="width: 100%">
        </div>
        <n-flex>
          <n-avatar
            style="
                border: 3px solid #fff;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                transition: all 0.3s;
                margin-left: 10px;
                &:hover {
                  transform: scale(1.05);
                }"
            round
            :size="64"
            :src=props.userAvatar
          />
          <n-p style="font-size: 20px">{{props.username}}</n-p>
        </n-flex>
        <n-divider/>
        <div>
          <slot/>
        </div>
      </template>
    </n-drawer-content>
  </n-drawer>

</template>
<script setup lang="ts">

interface Props{
  username?: string,
  userAvatar?: string
}

const props= withDefaults(defineProps<Props>(), {
  username:'未登录',
  userAvatar:'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg'
})

</script>



