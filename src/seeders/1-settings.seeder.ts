import "reflect-metadata";

import { postgresDataSource } from "../loaders/typeOrm.loader";

import { Setting, SettingsGroup } from "../models/settings.model";

import { eAppSettings, eSocialLinksSettings } from "../constants/app.constant";

const settingsData = [
  {
    name: "App",
    code: "app",
    description: "Application information",
    settings: [
      {
        name: "No-reply Email",
        description: "Email to use as from address for emails users' can't reply too",
        code: eAppSettings.NOREPLY_EMAIL,
        value: "no-reply@app.com",
      },
      {
        name: "Support Email",
        description: "Support email for users to reach out to",
        code: eAppSettings.SUPPORT_EMAIL,
        value: "support@app.com",
      },
      {
        name: "Support Telephone",
        description: "Telephone number for users to reach out to",
        code: eAppSettings.SUPPORT_TELEPHONE,
        value: "(+234) 810 123 4567",
      },
      {
        name: "Address",
        description: "Physical address for display on website",
        code: eAppSettings.ADDRESS,
        value: "No 5, Some Random Street, FCT, Nigeria.",
      },
    ],
  },
  {
    name: "Social links",
    code: "social_links",
    description: "Social links for App website",
    settings: [
      {
        name: "LinkedIn Link",
        description: "Official LinkedIn profile link",
        code: eSocialLinksSettings.LINKEDIN,
        value: "https://linkedin.com/app",
      },
      {
        name: "X Link",
        description: "Official X profile link",
        code: eSocialLinksSettings.X,
        value: "https://x.com/app",
      },
      {
        name: "Instagram Link",
        description: "Official Instagram profile link",
        code: eSocialLinksSettings.INSTAGRAM,
        value: "https://instagram.com/app",
      },
      {
        name: "Facebook Link",
        description: "Official Facebook profile link",
        code: eSocialLinksSettings.FACEBOOK,
        value: "https://facebook.com/app",
      },
    ],
  },
];

(async function () {
  try {
    await postgresDataSource.initialize();

    await postgresDataSource.transaction(async (manager) => {
      const settingsRepository = manager.getRepository(Setting);
      const settingsGroupRepository = manager.getRepository(SettingsGroup);

      for (const settingData of settingsData) {
        const settings = settingData.settings;

        // @ts-ignore
        delete settingData.settings;

        const settingsGroup = await settingsGroupRepository.save(settingData);

        await settingsRepository.save(
          settings.map((setting) => ({
            ...setting,
            settings_group_id: settingsGroup.id,
          })),
        );
      }
    });
  } catch (err) {
    console.log(err);
  } finally {
    await postgresDataSource.destroy();
  }
})();
