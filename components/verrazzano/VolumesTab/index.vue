<script>
// Added by Verrazzano
import AddNamedElement from '@/components/verrazzano/AddNamedElement';
import TabDeleteButton from '@/components/verrazzano/TabDeleteButton';
import TreeTab from '@/components/verrazzano/TreeTabbed/TreeTab';
import Volume from '@/components/verrazzano/VolumesTab/Volume';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';

import { randomStr } from '@/utils/string';
import debounce from 'lodash/debounce';

export default {
  name:       'VolumesTab',
  components: {
    AddNamedElement,
    TabDeleteButton,
    TreeTab,
    Volume,
  },
  mixins: [VerrazzanoHelper],
  props:  {
    value: {
      type:    Array,
      default: () => ([])
    },
    mode: {
      type:    String,
      default: 'create'
    },
    namespacedObject: {
      type:     Object,
      required: true
    },
    tabName: {
      type:     String,
      required: true
    },
    tabLabel: {
      type:    String,
      default: ''
    },
  },
  data() {
    const volumes = this.value.map((volume) => {
      const newVolume = this.clone(volume);

      newVolume._id = randomStr(4);

      return newVolume;
    });

    return {
      treeTabName:  this.tabName,
      treeTabLabel: this.tabLabel,
      volumes,
    };
  },
  methods: {
    update() {
      const volumes = [];

      this.volumes.forEach((volume) => {
        const newVolume = this.clone(volume);

        delete newVolume._id;

        volumes.push(newVolume);
      });
      this.$emit('input', volumes);
    },
    addVolume(name) {
      this.volumes.push({ _id: randomStr(4), name });
      this.queueUpdate();
    },
    removeVolume(index) {
      this.volumes.splice(index, 1);
      this.queueUpdate();
    },
    deleteVolumes() {
      this.volumes.length = 0;
      this.queueUpdate();
    }
  },
  created() {
    if (!this.treeTabLabel) {
      this.treeTabLabel = this.t('verrazzano.common.tabs.volumes');
    }

    this.queueUpdate = debounce(this.update, 500);
  }
};
</script>

<template>
  <TreeTab :name="treeTabName" :label="treeTabLabel">
    <template #beside-header>
      <TabDeleteButton
        :element-name="t('verrazzano.common.tabs.volumes')"
        :mode="mode"
        @click="deleteVolumes()"
      />
    </template>
    <template #default>
      <AddNamedElement
        key-field-name="name"
        :mode="mode"
        :add-type="t('verrazzano.common.tabs.volume')"
        :field-label="t('verrazzano.common.fields.volume.name')"
        @input="addVolume($event)"
      />
    </template>
    <template #nestedTabs>
      <TreeTab
        v-for="(volume, idx) in volumes"
        :key="volume._id"
        :name="createTabKey(treeTabName, volume.name)"
        :label="volume.name"
      >
        <template #beside-header>
          <TabDeleteButton
            :element-name="t('verrazzano.common.tabs.volume')"
            :mode="mode"
            @click="removeVolume(idx)"
          />
        </template>
        <template #default>
          <Volume
            :value="volume"
            :mode="mode"
            :namespaced-object="namespacedObject"
            @input="queueUpdate"
          />
        </template>
      </TreeTab>
    </template>
  </TreeTab>
</template>

<style scoped>

</style>
