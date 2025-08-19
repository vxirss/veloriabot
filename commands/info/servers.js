export default {
    data: {
        name: 'servers',
        description: 'Wyświetla listę serwerów, na których jest bot oraz ich właścicieli',
    },
    async execute(interaction) {
        // Podaj tutaj swój ID developera
        const developerId = '1179471266592333929';
        if (interaction.user.id !== developerId) {
            return await interaction.reply({ content: 'Ta komenda jest dostępna tylko dla developera.', ephemeral: true });
        }
        // Pobierz właścicieli serwerów asynchronicznie
        const guilds = await Promise.all(
            interaction.client.guilds.cache.map(async guild => {
                let ownerTag = 'Nieznany';
                try {
                    const owner = await guild.fetchOwner();
                    ownerTag = owner.user.tag;
                } catch {}
                return {
                    name: guild.name,
                    value: `Właściciel: ${ownerTag} (${guild.ownerId})`
                };
            })
        );
        const { EmbedBuilder } = await import('discord.js');
        const embed = new EmbedBuilder()
            .setTitle('Serwery, na których jest bot')
            .setColor(0x5865F2)
            .setDescription('Lista serwerów i ich właścicieli:')
            .addFields(guilds.length ? guilds : [{ name: 'Brak serwerów', value: 'Bot nie jest na żadnym serwerze.' }])
            .setTimestamp();
        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};