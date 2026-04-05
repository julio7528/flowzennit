export const getPrivacyContent = (t) => ({
  lastUpdated: t('privacy.lastUpdated'),
  statusBadges: t('privacy.statusBadges', { returnObjects: true }),
  heroPoints: t('privacy.heroPoints', { returnObjects: true }),
  dataGroups: t('privacy.dataGroups', { returnObjects: true }),
  purposes: t('privacy.purposes', { returnObjects: true }),
  thirdParties: t('privacy.thirdParties', { returnObjects: true }),
  cookieCategories: t('privacy.cookieCategories', { returnObjects: true }),
  rights: t('privacy.rights', { returnObjects: true }),
  retentionRules: t('privacy.retentionRules', { returnObjects: true }),
  governanceItems: t('privacy.governanceItems', { returnObjects: true }),
  requestTypes: t('privacy.requestTypes', { returnObjects: true }),
})

export const COOKIE_CATEGORIES = [
  {
    key: 'necessary',
    translationKey: 'privacy.cookieCategories.0',
    accent: '#00F0FF',
    alwaysOn: true,
  },
  {
    key: 'analytics',
    translationKey: 'privacy.cookieCategories.1',
    accent: '#BD00FF',
    alwaysOn: false,
  },
]
