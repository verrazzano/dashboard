<script>
// Added by Verrazzano
import AuxiliaryImage from '@/edit/core.oam.dev.component/VerrazzanoWebLogicWorkload/AuxiliaryImage';
import ArrayListGrouped from '@/components/form/ArrayListGrouped';
import { randomStr } from '@/utils/string';
import debounce from 'lodash/debounce';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';

export default {
  name:       'AuxiliaryImages',
  components: {
    ArrayListGrouped,
    AuxiliaryImage
  },
  mixins: [VerrazzanoHelper],
  props:  {
    value: {
      // parent object (e.g., pod spec)
      type:    Object,
      default: () => ({})
    },
    mode: {
      type:    String,
      default: 'create'
    },
    rootFieldName: {
      type:    String,
      default: 'auxiliaryImages'
    },
    namespacedObject: {
      type:     Object,
      required: true
    }
  },
  data() {
    const images = (this.value[this.rootFieldName] || []).map((image) => {
      const newImage = this.clone(image);

      newImage._id = randomStr(4);

      return newImage;
    });

    return { images };
  },
  methods: {
    update() {
      const images = [];

      this.images.forEach((image) => {
        const newImage = this.clone(image);

        delete newImage._id;

        images.push(newImage);
      });

      this.setFieldIfNotEmpty(this.rootFieldName, images);
    },
    addImage() {
      this.images.push({ _id: randomStr(4) });
    },
    removeImage(index) {
      this.images.splice(index, 1);

      this.queueUpdate();
    }
  },
  created() {
    this.queueUpdate = debounce(this.update, 500);
  }
};
</script>

<template>
  <div>
    <ArrayListGrouped
      v-model="value[rootFieldName]"
      :mode="mode"
      :default-add-value="{ }"
      :add-label="t('verrazzano.weblogic.buttons.addAuxiliaryImage')"
      @add="addImage()"
    >
      <template #remove-button="removeProps">
        <button
          v-if="showListRemoveButton(rootFieldName)"
          type="button"
          class="btn role-link close btn-sm"
          @click="removeImage(removeProps.i)"
        >
          <i class="icon icon-2x icon-x" />
        </button>
        <span v-else />
      </template>
      <template #default="props">
        <AuxiliaryImage
          v-model="props.row.value"
          :mode="mode"
          :namespaced-object="namespacedObject"
        />
      </template>
    </ArrayListGrouped>
    <div v-if="showEmptyListMessage('auxiliaryImages')">
      {{ t('verrazzano.VerrazzanoWebLogicWorkload.config.values.noAuxiliaryImages') }}
    </div>
  </div>
</template>

<style scoped>
  @import "../verrazzano-styles.css";
</style>
