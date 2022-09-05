<template>
  <ModalBox
    :show="this.message"
    @close="this.onCancel"
  >
    <template v-slot:modalHeader>
      <h1 class="grow leading-[3] text-xl pl-8">CONFIRM</h1>
    </template>
    <template v-slot:modalBody>
      <p class=" text-lg mb-5 text-center">
        {{ this.message }}
      </p>
      <div class="flex justify-center gap-x-3">
        <PrimaryButton @click="this.onConfirm">
          <span class="flex items-center gap-x-1 mr-5">
            <BIconCheck class="text-3xl"/> OKAY
          </span>
        </PrimaryButton>
        <SecondaryButton @click="this.onCancel">
          <span class="flex items-center gap-x-1 mr-5">
            <BIconX class="text-3xl"/>  CANCEL
          </span>
        </SecondaryButton>
      </div>
    </template>
  </ModalBox>
</template>

<script>
import { BIconCheck, BIconX } from 'bootstrap-icons-vue';
import ModalBox from './ModalBox.vue';
import PrimaryButton from './PrimaryButton.vue'
import SecondaryButton from './SecondaryButton.vue';
export default {
    data(){
        return { 
          message: null,
          handleConfirm: null,
          handleCancel: null
      }
    },
    methods: {
      show(message){
        this.message = message;
        return new Promise((resolve, reject)=>{
          this.handleConfirm = resolve;
          this.handleCancel = reject;
        })
      },
      onConfirm(){
          if(this.handleConfirm) this.handleConfirm();
          this.clearDialogue()
      },
      onCancel(){
          if(this.handleCancel) this.handleCancel();
          this.clearDialogue()
      },
      clearDialogue(){
          this.message = null;
          this.handleConfirm = null;
          this.handleCancel = null;
      }
    },
    components: { ModalBox, PrimaryButton, BIconCheck, BIconX, SecondaryButton }
}
</script>
