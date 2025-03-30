<template>
  <div class="popup">
    <div class="content">
      <div class="close">
        <i class="fa-solid fa-xmark"></i>
      </div>
      <div id="colorPicker" class="row"></div>
    </div>
  </div>
</template>

<script>
import iro from '@jaames/iro'

export default {
  data() {
    return {
    }
  },
  mounted() {
    const colorPicker = new iro.ColorPicker('#colorPicker', {
      color: localStorage.getItem('accent_color') || '#151e15',
      width: 320,
      borderWidth: 2,
      borderColor: '#fff',
      layout: [
        {
          component: iro.ui.Slider,
          options: {
            sliderType: 'hue'
          }
        },
        {
          component: iro.ui.Slider,
          options: {
            sliderType: 'saturation'
          }
        },
        {
          component: iro.ui.Slider,
          options: {
            sliderType: 'value'
          }
        },
      ]
    })

    colorPicker.on(['color:init', 'input:change'], (color) => {
      document.body.style.backgroundColor = color.hexString
      document.querySelectorAll('.theme-color').forEach((element) => {
        element.content = color.hexString
      })
      if (color.hsl.l >= 45) {
        document.querySelector('html').classList.add('light')
        document.querySelector('html').classList.remove('dark')
      } else {
        document.querySelector('html').classList.add('dark')
        document.querySelector('html').classList.remove('light')
      }
      localStorage.setItem('accent_color', color.hexString)
    })
  }
}
</script>
