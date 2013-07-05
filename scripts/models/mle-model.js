App.Store.registerAdapter('App.Mle', DS.FixtureAdapter);

App.Mle = DS.Model.extend({
  name: DS.attr('string'),
  version: DS.attr('string'),
  attestationType: DS.attr('string'),
  mleType: DS.attr('string'),
  osInfo: DS.attr('string'),
  oemName: DS.attr('string'),
  description: DS.attr('string')
});

App.Mle.FIXTURES = [{
    id: 1,
    name: 'MLE 1',
    version: '1.0',
    attestationType: 'PCR',
    mleType: 'BIOS',
    osInfo: 'Ubuntu 11.10',
    oemName: 'n/a',
    description: 'MLE 1 Description'
  }, {
    id: 2,
    name: 'MLE 2',
    version: '1.0',
    attestationType: 'PCR',
    mleType: 'VMM',
    osInfo: 'Ubuntu 11.10',
    oemName: 'n/a',
    description: 'MLE 2 Description'
  }, {
    id: 3,
    name: 'MLE 3',
    version: '1.0',
    attestationType: 'PCR',
    mleType: 'BIOS',
    osInfo: 'Ubuntu 12.04',
    oemName: 'n/a',
    description: 'MLE 3 Description'
  }, {
    id: 4,
    name: 'MLE 4',
    version: '1.0',
    attestationType: 'PCR',
    mleType: 'VMM',
    osInfo: 'Ubuntu 12.04',
    oemName: 'n/a',
    description: 'MLE 4 Description'
  }
];
