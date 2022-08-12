<script>
// Added by Verrazzano
import ConfigMap from '@/edit/core.oam.dev.component/ConfigMap';
import ContainerizedWorkload from '@/edit/core.oam.dev.component/ContainerizedWorkload';
import CruResource from '@/components/CruResource';
import LabeledInput from '@/components/form/LabeledInput';
import LabeledSelect from '@/components/form/LabeledSelect';
import Loading from '@/components/Loading';
import NameNsDescription from '@/components/form/NameNsDescription';
import Tab from '@/components/Tabbed/Tab';
import Tabbed from '@/components/Tabbed';
import VerrazzanoCoherenceWorkload from '@/edit/core.oam.dev.component/VerrazzanoCoherenceWorkload';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';
import VerrazzanoHelidonWorkload from './VerrazzanoHelidonWorkload';
import VerrazzanoWebLogicWorkload from './VerrazzanoWebLogicWorkload';
import Secret from './Secret';

const TAB_WEIGHT_MAP = {
  general:              99,
  containers:           98,
};

const creatableTypes = [
  'VerrazzanoCoherenceWorkload',
  'VerrazzanoHelidonWorkload',
  'VerrazzanoWebLogicWorkload',
  'ContainerizedWorkload',
  'ConfigMap',
  'Secret',
  'Deployment',
  'Service',
];

export default {
  name:       'VzComponent',
  components: {
    ConfigMap,
    ContainerizedWorkload,
    CruResource,
    LabeledInput,
    LabeledSelect,
    Loading,
    NameNsDescription,
    Tab,
    Tabbed,
    VerrazzanoCoherenceWorkload,
    VerrazzanoHelidonWorkload,
    VerrazzanoWebLogicWorkload,
    Secret,
  },
  mixins: [VerrazzanoHelper],
  props:  {
    value: {
      type:     Object,
      required: true
    },
    mode: {
      type:    String,
      default: 'create'
    }
  },
  data() {
    return {
      componentType: this.value.spec?.workload?.kind || '',
      tabWeightMap:  TAB_WEIGHT_MAP,
    };
  },
  computed: {
    // array of id, label, description, initials for type selection step
    componentSubTypes() {
      const out = [];

      for (const creatableType of creatableTypes) {
        out.push({
          id:          creatableType,
          label:       this.t(`verrazzano.types.${ creatableType }`),
          bannerAbbrv: this.t(`verrazzano.typeAbbreviations.${ creatableType }`),
          description: this.t(`verrazzano.typeDescriptions.${ creatableType }.description`),
          docLink:     this.t(`verrazzano.typeDescriptions.${ creatableType }.docLink`)
        });
      }

      return out;
    },
  },
  methods: {
    selectType(creatableType) {
      this.componentType = creatableType;
    }
  }
};
</script>

<template>
  <form>
    <CruResource
      :mode="mode"
      :validation-passed="true"
      :selected-subtype="componentType"
      :resource="value"
      :errors="errors"
      :subtypes="componentSubTypes"
      :done-route="doneRoute"
      @finish="save"
      @select-type="selectType"
      @error="e => errors = e"
    >
      <NameNsDescription v-model="value" :mode="mode" />
      <component :is="componentType" :value="value" :mode="mode" />
    </CruResource>
  </form>
</template>

<style lang='scss'>
.container-row{
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.type-placeholder{
  color: white;
  font-size: 2.5em;
  height: 100%;
  width: 100%;
  background-color: var(--primary);
  display: flex;
  justify-content: center;
  align-items: center;
}

.type-description{
  color: var(--input-label)
}

.next-dropdown{
  display: inline-block;
}
</style>
