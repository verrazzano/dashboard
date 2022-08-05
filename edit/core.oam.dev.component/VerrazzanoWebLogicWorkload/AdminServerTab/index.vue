<script>
// Added by Verrazzano
import AdminServer from '@/edit/core.oam.dev.component/VerrazzanoWebLogicWorkload/AdminServerTab/AdminServer';
import ServerPodTab from '@/edit/core.oam.dev.component/VerrazzanoWebLogicWorkload/ServerPodTab';
import TreeTab from '@/components/verrazzano/TreeTabbed/TreeTab';
import WeblogicWorkloadHelper from '@/mixins/verrazzano/weblogic-workload-helper';

export default {
  name:       'AdminServerTab',
  components: {
    AdminServer,
    ServerPodTab,
    TreeTab
  },
  mixins: [WeblogicWorkloadHelper],
  props:  {
    // the parent node of adminServer
    value: {
      type:    Object,
      default: () => ({})
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
      type:    String,
      default: 'adminServer'
    },
  },
};
</script>

<template>
  <TreeTab :label="t('verrazzano.weblogic.tabs.adminServer')" :name="tabName">
    <AdminServer
      :value="getField('adminServer')"
      :mode="mode"
      :namespaced-object="value"
      @input="setFieldIfNotEmpty('adminServer', $event)"
    />
    <template #nestedTabs>
      <ServerPodTab
        :value="getField('adminServer.serverPod')"
        :mode="mode"
        :namespaced-object="value"
        :tab-name="tabName"
        @input="setFieldIfNotEmpty('adminServer.serverPod', $event)"
      />
    </template>
  </TreeTab>
</template>
