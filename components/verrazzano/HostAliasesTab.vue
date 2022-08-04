<script>
// Added by Verrazzano
import AddNamedElement from '@/components/verrazzano/AddNamedElement';
import DynamicTabHelper from '@/mixins/verrazzano/dynamic-tab-helper';
import LabeledArrayList from '@/components/verrazzano/LabeledArrayList';
import LabeledInput from '@/components/form/LabeledInput';
import TabDeleteButton from '@/components/verrazzano/TabDeleteButton';
import TreeTab from '@/components/verrazzano/TreeTabbed/TreeTab';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';

import { randomStr } from '@/utils/string';
import debounce from 'lodash/debounce';

export default {
  name:       'HostAliasesTab',
  components: {
    AddNamedElement,
    LabeledArrayList,
    LabeledInput,
    TabDeleteButton,
    TreeTab,
  },
  mixins: [VerrazzanoHelper, DynamicTabHelper],
  props:  {
    value: {
      type:    Array,
      default: () => ([])
    },
    mode: {
      type:    String,
      default: 'create'
    },
    tabName: {
      type:     String,
      required: true
    },
    tabLabel: {
      type:    String,
      default: ''
    }
  },
  data() {
    const hostAliases = this.value.map((hostAlias) => {
      const newHostAlias = this.clone(hostAlias);

      newHostAlias._id = randomStr(4);

      return newHostAlias;
    });

    return {
      treeTabName:  this.tabName,
      treeTabLabel: this.tabLabel,
      hostAliases,
    };
  },
  methods: {
    update() {
      const hostAliases = [];

      this.hostAliases.forEach((hostAlias) => {
        const newHostAlias = this.clone(hostAlias);

        delete newHostAlias._id;

        hostAliases.push(newHostAlias);
      });
      this.$emit('input', hostAliases);
    },
    clearHostAliases() {
      this.hostAliases.length = 0;
      this.queueUpdate();
    },
    addHostAlias(newIpAddress) {
      this.hostAliases.push({ _id: randomStr(4), ip: newIpAddress });
      this.queueUpdate();
    },
    removeHostAlias(index) {
      this.hostAliases.splice(index, 1);
      this.queueUpdate();
    },
  },
  created() {
    if (!this.treeTabLabel) {
      this.treeTabLabel = this.t('verrazzano.common.tabs.hostAliases');
    }

    this.queueUpdate = debounce(this.update, 500);
  }
};
</script>

<template>
  <TreeTab :name="treeTabName" :label="treeTabLabel">
    <template #beside-header>
      <TabDeleteButton
        :mode="mode"
        element-name="treeTabLabel"
        @click="clearHostAliases()"
      />
    </template>
    <template #default>
      <AddNamedElement
        key-field-name="ip"
        :mode="mode"
        :add-type="t('verrazzano.common.tabs.hostAlias')"
        :field-label="t('verrazzano.common.fields.newIpAddress')"
        @input="addHostAlias($event)"
      />
    </template>
    <template #nestedTabs>
      <TreeTab
        v-for="(hostAlias, idx) in hostAliases"
        :key="hostAlias._id"
        :name="createTabKey(treeTabName, hostAlias.ip)"
        :label="hostAlias.ip"
      >
        <template #beside-header>
          <TabDeleteButton
            :mode="mode"
            :element-name="t('verrazzano.common.tabs.hostAlias')"
            @click="removeHostAlias(idx)"
          />
        </template>
        <template #default>
          <div class="row">
            <div class="col span-4">
              <LabeledInput
                :value="getDynamicTabField(hostAlias, 'ip')"
                :mode="mode"
                required
                disabled
                :placeholder="getNotSetPlaceholder(hostAlias, 'ip')"
                :label="t('verrazzano.common.fields.ipAddress')"
                @input="setDynamicTabFieldIfNotEmpty(hostAlias, 'ip', $event, true)"
              />
            </div>
            <div class="col span-4">
              <LabeledArrayList
                :value="getDynamicTabListField(hostAlias, 'hostnames')"
                :mode="mode"
                required
                :value-label="t('verrazzano.common.fields.hostname')"
                :add-label="t('verrazzano.common.buttons.addHostName')"
                initial-empty-row
                @input="setDynamicTabFieldIfNotEmpty(hostAlias, 'hostnames', $event, true)"
              />
            </div>
          </div>
        </template>
      </TreeTab>
    </template>
  </TreeTab>
</template>

<style scoped>

</style>
