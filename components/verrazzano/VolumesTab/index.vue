<script>
// Added by Verrazzano
import AddNamedElement from '@/components/verrazzano/AddNamedElement';
import DynamicListHelper from '@/mixins/verrazzano/dynamic-list-helper';
import TabDeleteButton from '@/components/verrazzano/TabDeleteButton';
import TreeTab from '@/components/verrazzano/TreeTabbed/TreeTab';
import Volume from '@/components/verrazzano/VolumesTab/Volume';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';

export default {
  name:       'VolumesTab',
  components: {
    AddNamedElement,
    TabDeleteButton,
    TreeTab,
    Volume,
  },
  mixins: [VerrazzanoHelper, DynamicListHelper],
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
    return {
      treeTabName:  this.tabName,
      treeTabLabel: this.tabLabel,
    };
  },
  methods: {
    addVolume(name) {
      this.dynamicListAddChild({ name });
    },
    removeVolume(index) {
      this.dynamicListDeleteChildByIndex(index);
    },
    deleteVolumes() {
      this.dynamicListClearChildrenList();
    }
  },
  created() {
    if (!this.treeTabLabel) {
      this.treeTabLabel = this.t('verrazzano.common.tabs.volumes');
    }
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
        v-for="(volume, idx) in dynamicListChildren"
        :key="volume._id"
        :name="createTabName(treeTabName, volume.name)"
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
            @input="dynamicListUpdate"
          />
        </template>
      </TreeTab>
    </template>
  </TreeTab>
</template>

<style scoped>

</style>
