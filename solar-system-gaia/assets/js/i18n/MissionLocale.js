import { nameTranslations } from './SimulatorTranslations.js';

const messages = {
  pt: {
    chooseMode: 'Escolher modo', journal: 'Diário de Bordo', startExploration: 'Iniciar exploração', startLaunch: 'Iniciar lançamento',
    finishAnalysis: 'Concluir análise', processing: 'Processando dados...', questions: 'Ir para as perguntas', reviewDossier: 'Rever dossiê', returnToQuestion: 'Voltar à pergunta',
    analysisCenter: 'Centro de Análise', scanningEvidence: 'Escaneando evidências', collectedEvidence: 'Evidências coletadas', analysisReady: 'Análise concluída. O relatório científico está disponível.',
    continue: 'Continuar', restartCampaign: 'Reiniciar campanha', continueExploring: 'Continuar explorando', close: 'Fechar',
    missionMode: 'Modo Missão', explorationMode: 'Modo Exploração', editProfile: 'Editar perfil', discoveries: 'Ver descobertas',
    reduceMotion: 'Reduzir animações', highContrast: 'Alto contraste', accessibility: 'Acessibilidade', tutorial: 'Tutorial de bordo', reviewInstructions: 'Rever instruções', dailyChallenge: 'Desafio do Dia', scientificExpedition: 'Expedição Científica',
    contentNotice: '', soundOn: 'Som ligado', soundOff: 'Som desligado', volume: 'Volume', saveError: 'Não foi possível salvar o progresso. Verifique o espaço do navegador antes de fechar o jogo.',
    mission: 'Missão', level: 'Nível', campaignComplete: 'Campanha concluída', nextMission: 'Próxima missão',
    question: 'Pergunta', evidenceHint: 'Pista dos sensores', analysisHint: 'Pista da análise', reviewHint: 'Recomendação',
    retrySoon: 'Analise a pista antes de tentar novamente.', reviewRecommendation: 'Reveja o dossiê e compare as evidências antes de responder.',
    resumedQuestion: 'Missão retomada exatamente da pergunta que estava pendente.', stars: 'Estrelas', chapter: 'Capítulo',
    chapterComplete: 'Capítulo concluído', chapterPlanetaryAtlas: 'Atlas Planetário', chapterAdvancedAnalysis: 'Análise Avançada',
    chapterJovianWorlds: 'Luas da Terra e de Júpiter', chapterOuterFrontiers: 'Fronteiras Exteriores', chapterBonusArchive: 'Arquivo Bônus',
    moveUp: 'Mover para cima', moveDown: 'Mover para baixo', checkOrder: 'Verificar ordem', orderingMismatch: 'A sequência ainda não corresponde às evidências.',
    eraseData: 'Apagar meus dados', eraseDataHint: 'Remover perfil, progresso e preferências deste dispositivo', privacyAndData: 'Privacidade e dados', eraseDataTitle: 'Apagar todos os dados?',
    eraseDataDescription: 'Seu perfil, campanha, desafios, expedições e preferências serão removidos deste dispositivo. Esta ação não pode ser desfeita.', cancel: 'Cancelar', confirmEraseData: 'Sim, apagar tudo', eraseDataFailure: 'O navegador impediu a remoção completa. Nenhum dado novo foi gravado; tente novamente nas configurações do site.',
    appTitle: 'Sistema Solar 3D — Projeto Gaia', bootKicker: 'Iniciativa científica · Ano 2184', bootSubtitle: 'Sistema de exploração e conhecimento planetário', bootInitializing: 'Inicializando sistemas...', bootCore: 'Iniciando núcleo do Projeto Gaia', bootRenderer: 'Calibrando renderização tridimensional', bootStars: 'Mapeando estrelas e espaço profundo', bootPlanets: 'Preparando planetas e atmosferas', bootMoons: 'Sincronizando luas e órbitas', bootFiles: 'Carregando arquivos científicos', bootReady: 'Sistemas prontos para exploração', bootMissionUnavailable: 'Modo livre disponível · arquivos de missão indisponíveis', enterSystem: 'Entrar no sistema', skipOpening: 'Pular esta abertura nas próximas visitas', releaseVersion: 'Versão 1.0.2', systemWarning: 'Aviso do Sistema:', renderingInterrupted: 'Ocorreu uma interrupção no carregamento tridimensional.',
    currentMission: 'Projeto Gaia · Missão atual', preparingMission: 'Preparando missão...', sound: 'Som', missionFocusDefault: 'Aproximar do sistema', commander: 'Comandante',
    profileEyebrow: 'Projeto Gaia · Registro de tripulação', profileTitle: 'Identificação do comandante', profileSubtitle: 'Antes da primeira missão, registre sua identificação na tripulação.', commanderName: 'Nome do comandante', commanderNamePlaceholder: 'Digite seu nome', chooseAvatar: 'Escolha seu avatar', confirmIdentification: 'Confirmar identificação', editProfileTitle: 'Editar perfil do comandante', editProfileSubtitle: 'Atualize como você será identificado no Projeto Gaia.', profileValidation: 'Preencha um nome e escolha um avatar.', profileSaveFailure: 'Não foi possível salvar o perfil neste navegador. Verifique o armazenamento e tente novamente.',
    avatarAstronaut: 'Astronauta', avatarScientist: 'Pesquisadora', avatarEngineer: 'Engenheiro', avatarCommander: 'Comandante', crewMember: 'Integrante da tripulação',
    modeEyebrow: 'Ano 2184 · Projeto Gaia', modeTitle: 'Como deseja explorar?', modeDescription: 'A humanidade criou uma iniciativa científica para ampliar nosso conhecimento sobre recursos, ambientes e fenômenos do Sistema Solar.', explorationDescription: 'Navegue livremente pelo simulador e consulte os corpos celestes.', missionDescription: 'Cumpra objetivos científicos, responda perguntas e evolua no Projeto Gaia.',
    missionControlSpeaker: 'Dra. Helena Vega · Controle da Missão', destinationConfirmed: 'Destino confirmado', prepareLaunch: 'Preparar lançamento', analysisEyebrow: 'Centro de Análise · Projeto Gaia', learnMore: 'Saiba mais', scientificSources: 'Fontes científicas', sourcesReviewed: 'Conteúdo revisado em {date}. Links oficiais abrem em uma nova guia.',
    personalArchive: 'Arquivo pessoal · Projeto Gaia', completed: 'Concluídas', attempts: 'Tentativas', accuracy: 'Precisão', discoveryArchive: 'Arquivo de descobertas', investigationComplete: 'Investigação concluída', currentMissionStatus: 'Missão atual', locked: 'Bloqueado', dossier: 'Dossiê', train: 'Treinar', replayJourney: 'Rever viagem', trainingEyebrow: 'Simulação de treinamento · Sem XP', nextQuestion: 'Próxima pergunta', backToJournal: 'Voltar ao diário', finishTraining: 'Concluir treinamento', freeTraining: 'Treinamento livre: nenhuma recompensa de XP será alterada.', trainingIncorrect: 'Resposta incorreta. Consulte o dossiê depois ou tente novamente.', trainingCorrect: 'Resposta correta. Este resultado não altera o XP oficial.', trainingTitle: 'Treinamento: {target}',
    scientificAnalysis: 'Análise científica', transmittedReport: 'Relatório transmitido', firstCycleComplete: 'Primeiro ciclo concluído', campaignDefaultText: 'As investigações científicas foram finalizadas. Seu conhecimento ajudará a orientar as próximas etapas do Projeto Gaia.', calculatingRoute: 'Calculando rota...',
    closeJournal: 'Fechar diário', closeChallenge: 'Fechar desafio', closeExpedition: 'Fechar expedição', closeInformation: 'Fechar informações', closeAbout: 'Fechar sobre o projeto', languageLabel: 'Idioma da interface', campaignProgress: 'Progresso da campanha', rocketLabel: 'Foguete do Projeto Gaia',
    restartConfirm: 'Reiniciar a campanha apagará o XP e o progresso das missões. Seu nome e avatar serão preservados. Deseja continuar?', restartSuccess: 'Campanha reiniciada. A primeira missão está disponível novamente.', incorrectTarget: '{body} não é o alvo desta missão. Continue investigando.', duplicateEvidence: 'A evidência de {body} já foi registrada.', hostFollowing: '{body} em acompanhamento. Arraste para girar a câmera e procure {target} ao redor dele.', evidenceRecorded: 'Evidência registrada: {body} ({observed}/{total}). Ainda falta: {remaining}.', backOverview: 'Voltar à visão geral', focusBody: 'Aproximar de {body}', cameraFollowing: 'Câmera acompanhando {body}. Arraste para girar, use o zoom e selecione {target}.', movementFrozen: 'Movimento congelado',
    answerCorrectNext: 'Resposta correta: +{xp} XP. Próxima análise:', campaignSummary: '{missions} investigações foram concluídas. Você acumulou {xp} XP e alcançou o nível {level}.', objectivePrefix: 'Objetivo: {objective}', launchConfirmation: '{target} foi confirmado. Autorize a decolagem para iniciar a análise científica.', destinationReached: 'Destino alcançado: +{xp} XP. Use os dados coletados.', useScannerData: 'Use os dados coletados pelo scanner.', missionCompletedReward: 'Missão concluída: +{xp} XP nesta pergunta · {stars}', selectedMismatch: '“{selected}” não corresponde às evidências coletadas.', routeConfirmed: 'Rota confirmada para {target}', launchWord: 'LANÇAR',
    levelCadet: 'Cadete', levelExplorer: 'Explorador', levelResearcher: 'Pesquisador', levelCommander: 'Comandante', levelPlanetarySpecialist: 'Especialista Planetário', levelSolarExplorer: 'Explorador do Sistema Solar', levelFrontierPioneer: 'Pioneiro das Fronteiras'
  },
  en: {
    chooseMode: 'Choose mode', journal: 'Mission Journal', startExploration: 'Start exploration', startLaunch: 'Start launch',
    finishAnalysis: 'Complete analysis', processing: 'Processing data...', questions: 'Go to questions', reviewDossier: 'Review dossier', returnToQuestion: 'Back to question',
    analysisCenter: 'Analysis Center', scanningEvidence: 'Scanning evidence', collectedEvidence: 'Collected evidence', analysisReady: 'Analysis complete. The scientific report is available.',
    continue: 'Continue', restartCampaign: 'Restart campaign', continueExploring: 'Continue exploring', close: 'Close',
    missionMode: 'Mission Mode', explorationMode: 'Exploration Mode', editProfile: 'Edit profile', discoveries: 'View discoveries',
    reduceMotion: 'Reduce motion', highContrast: 'High contrast', accessibility: 'Accessibility', tutorial: 'Onboard tutorial', reviewInstructions: 'Review instructions', dailyChallenge: 'Daily Challenge', scientificExpedition: 'Scientific Expedition',
    contentNotice: '', soundOn: 'Sound on', soundOff: 'Sound off', volume: 'Volume', saveError: 'Progress could not be saved. Check browser storage before closing the game.',
    mission: 'Mission', level: 'Level', campaignComplete: 'Campaign complete', nextMission: 'Next mission',
    question: 'Question', evidenceHint: 'Sensor clue', analysisHint: 'Analysis clue', reviewHint: 'Recommendation',
    retrySoon: 'Analyze the clue before trying again.', reviewRecommendation: 'Review the dossier and compare the evidence before answering.',
    resumedQuestion: 'Mission resumed at the exact question that was pending.', stars: 'Stars', chapter: 'Chapter',
    chapterComplete: 'Chapter complete', chapterPlanetaryAtlas: 'Planetary Atlas', chapterAdvancedAnalysis: 'Advanced Analysis',
    chapterJovianWorlds: 'Moons of Earth and Jupiter', chapterOuterFrontiers: 'Outer Frontiers', chapterBonusArchive: 'Bonus Archive',
    moveUp: 'Move up', moveDown: 'Move down', checkOrder: 'Check order', orderingMismatch: 'The sequence does not yet match the evidence.',
    eraseData: 'Erase my data', eraseDataHint: 'Remove profile, progress and preferences from this device', privacyAndData: 'Privacy and data', eraseDataTitle: 'Erase all data?',
    eraseDataDescription: 'Your profile, campaign, challenges, expeditions and preferences will be removed from this device. This cannot be undone.', cancel: 'Cancel', confirmEraseData: 'Yes, erase everything', eraseDataFailure: 'The browser prevented complete removal. Try again in the site settings.',
    appTitle: '3D Solar System — Project Gaia', bootKicker: 'Scientific initiative · Year 2184', bootSubtitle: 'Planetary exploration and knowledge system', bootInitializing: 'Initializing systems...', bootCore: 'Starting the Project Gaia core', bootRenderer: 'Calibrating 3D rendering', bootStars: 'Mapping stars and deep space', bootPlanets: 'Preparing planets and atmospheres', bootMoons: 'Synchronizing moons and orbits', bootFiles: 'Loading scientific archives', bootReady: 'Systems ready for exploration', bootMissionUnavailable: 'Free mode available · mission archives unavailable', enterSystem: 'Enter system', skipOpening: 'Skip this opening on future visits', releaseVersion: 'Version 1.0.2', systemWarning: 'System Warning:', renderingInterrupted: 'An interruption occurred while loading the 3D environment.',
    currentMission: 'Project Gaia · Current mission', preparingMission: 'Preparing mission...', sound: 'Sound', missionFocusDefault: 'Approach system', commander: 'Commander',
    profileEyebrow: 'Project Gaia · Crew registration', profileTitle: 'Commander identification', profileSubtitle: 'Before your first mission, register your crew identification.', commanderName: 'Commander name', commanderNamePlaceholder: 'Enter your name', chooseAvatar: 'Choose your avatar', confirmIdentification: 'Confirm identification', editProfileTitle: 'Edit commander profile', editProfileSubtitle: 'Update how you will be identified in Project Gaia.', profileValidation: 'Enter a name and choose an avatar.', profileSaveFailure: 'The profile could not be saved in this browser. Check storage and try again.',
    avatarAstronaut: 'Astronaut', avatarScientist: 'Scientist', avatarEngineer: 'Engineer', avatarCommander: 'Commander', crewMember: 'Crew member',
    modeEyebrow: 'Year 2184 · Project Gaia', modeTitle: 'How would you like to explore?', modeDescription: 'Humanity created a scientific initiative to expand our knowledge of Solar System resources, environments, and phenomena.', explorationDescription: 'Navigate the simulator freely and inspect celestial bodies.', missionDescription: 'Complete scientific objectives, answer questions, and progress through Project Gaia.',
    missionControlSpeaker: 'Dr. Helena Vega · Mission Control', destinationConfirmed: 'Destination confirmed', prepareLaunch: 'Prepare launch', analysisEyebrow: 'Analysis Center · Project Gaia', learnMore: 'Learn more', scientificSources: 'Scientific sources', sourcesReviewed: 'Content reviewed on {date}. Official links open in a new tab.',
    personalArchive: 'Personal archive · Project Gaia', completed: 'Completed', attempts: 'Attempts', accuracy: 'Accuracy', discoveryArchive: 'Discovery archive', investigationComplete: 'Investigation completed', currentMissionStatus: 'Current mission', locked: 'Locked', dossier: 'Dossier', train: 'Train', replayJourney: 'Replay journey', trainingEyebrow: 'Training simulation · No XP', nextQuestion: 'Next question', backToJournal: 'Back to journal', finishTraining: 'Finish training', freeTraining: 'Free training: no official XP rewards will be changed.', trainingIncorrect: 'Incorrect answer. Review the dossier later or try again.', trainingCorrect: 'Correct answer. This result does not change official XP.', trainingTitle: 'Training: {target}',
    scientificAnalysis: 'Scientific analysis', transmittedReport: 'Report transmitted', firstCycleComplete: 'First cycle completed', campaignDefaultText: 'The scientific investigations are complete. Your knowledge will help guide the next stages of Project Gaia.', calculatingRoute: 'Calculating route...',
    closeJournal: 'Close journal', closeChallenge: 'Close challenge', closeExpedition: 'Close expedition', closeInformation: 'Close information', closeAbout: 'Close about this project', languageLabel: 'Interface language', campaignProgress: 'Campaign progress', rocketLabel: 'Project Gaia rocket',
    restartConfirm: 'Restarting the campaign will erase XP and mission progress. Your name and avatar will be preserved. Continue?', restartSuccess: 'Campaign restarted. The first mission is available again.', incorrectTarget: '{body} is not the target of this mission. Keep investigating.', duplicateEvidence: 'Evidence for {body} has already been recorded.', hostFollowing: 'Following {body}. Drag to rotate the camera and look for {target} around it.', evidenceRecorded: 'Evidence recorded: {body} ({observed}/{total}). Remaining: {remaining}.', backOverview: 'Back to overview', focusBody: 'Approach {body}', cameraFollowing: 'Camera following {body}. Drag to rotate, use zoom, and select {target}.', movementFrozen: 'Movement frozen',
    answerCorrectNext: 'Correct answer: +{xp} XP. Next analysis:', campaignSummary: '{missions} investigations completed. You earned {xp} XP and reached the {level} level.', objectivePrefix: 'Objective: {objective}', launchConfirmation: '{target} confirmed. Authorize liftoff to begin the scientific analysis.', destinationReached: 'Destination reached: +{xp} XP. Use the collected data.', useScannerData: 'Use the data collected by the scanner.', missionCompletedReward: 'Mission completed: +{xp} XP for this question · {stars}', selectedMismatch: '“{selected}” does not match the collected evidence.', routeConfirmed: 'Route confirmed to {target}', launchWord: 'LAUNCH',
    levelCadet: 'Cadet', levelExplorer: 'Explorer', levelResearcher: 'Researcher', levelCommander: 'Commander', levelPlanetarySpecialist: 'Planetary Specialist', levelSolarExplorer: 'Solar System Explorer', levelFrontierPioneer: 'Frontier Pioneer'
  },
  es: {
    chooseMode: 'Elegir modo', journal: 'Diario de misión', startExploration: 'Iniciar exploración', startLaunch: 'Iniciar lanzamiento',
    finishAnalysis: 'Completar análisis', processing: 'Procesando datos...', questions: 'Ir a las preguntas', reviewDossier: 'Revisar informe', returnToQuestion: 'Volver a la pregunta',
    analysisCenter: 'Centro de Análisis', scanningEvidence: 'Escaneando evidencias', collectedEvidence: 'Evidencias recopiladas', analysisReady: 'Análisis completado. El informe científico está disponible.',
    continue: 'Continuar', restartCampaign: 'Reiniciar campaña', continueExploring: 'Continuar explorando', close: 'Cerrar',
    missionMode: 'Modo Misión', explorationMode: 'Modo Exploración', editProfile: 'Editar perfil', discoveries: 'Ver descubrimientos',
    reduceMotion: 'Reducir animaciones', highContrast: 'Alto contraste', accessibility: 'Accesibilidad', tutorial: 'Tutorial de a bordo', reviewInstructions: 'Revisar instrucciones', dailyChallenge: 'Desafío del Día', scientificExpedition: 'Expedición Científica',
    contentNotice: '', soundOn: 'Sonido activado', soundOff: 'Sonido desactivado', volume: 'Volumen', saveError: 'No se pudo guardar el progreso. Revisa el espacio del navegador antes de cerrar el juego.',
    mission: 'Misión', level: 'Nivel', campaignComplete: 'Campaña completada', nextMission: 'Siguiente misión',
    question: 'Pregunta', evidenceHint: 'Pista de los sensores', analysisHint: 'Pista del análisis', reviewHint: 'Recomendación',
    retrySoon: 'Analiza la pista antes de volver a intentarlo.', reviewRecommendation: 'Revisa el informe y compara las evidencias antes de responder.',
    resumedQuestion: 'Misión retomada exactamente en la pregunta que estaba pendiente.', stars: 'Estrellas', chapter: 'Capítulo',
    chapterComplete: 'Capítulo completado', chapterPlanetaryAtlas: 'Atlas Planetario', chapterAdvancedAnalysis: 'Análisis Avanzado',
    chapterJovianWorlds: 'Lunas de la Tierra y Júpiter', chapterOuterFrontiers: 'Fronteras Exteriores', chapterBonusArchive: 'Archivo Adicional',
    moveUp: 'Mover hacia arriba', moveDown: 'Mover hacia abajo', checkOrder: 'Comprobar orden', orderingMismatch: 'La secuencia todavía no coincide con las evidencias.',
    eraseData: 'Borrar mis datos', eraseDataHint: 'Eliminar perfil, progreso y preferencias de este dispositivo', privacyAndData: 'Privacidad y datos', eraseDataTitle: '¿Borrar todos los datos?',
    eraseDataDescription: 'Tu perfil, campaña, desafíos, expediciones y preferencias se eliminarán de este dispositivo. Esta acción no se puede deshacer.', cancel: 'Cancelar', confirmEraseData: 'Sí, borrar todo', eraseDataFailure: 'El navegador impidió la eliminación completa. Inténtalo de nuevo en la configuración del sitio.',
    appTitle: 'Sistema Solar 3D — Proyecto Gaia', bootKicker: 'Iniciativa científica · Año 2184', bootSubtitle: 'Sistema de exploración y conocimiento planetario', bootInitializing: 'Inicializando sistemas...', bootCore: 'Iniciando el núcleo del Proyecto Gaia', bootRenderer: 'Calibrando la renderización tridimensional', bootStars: 'Mapeando estrellas y espacio profundo', bootPlanets: 'Preparando planetas y atmósferas', bootMoons: 'Sincronizando lunas y órbitas', bootFiles: 'Cargando archivos científicos', bootReady: 'Sistemas listos para la exploración', bootMissionUnavailable: 'Modo libre disponible · archivos de misión no disponibles', enterSystem: 'Entrar al sistema', skipOpening: 'Omitir esta apertura en futuras visitas', releaseVersion: 'Versión 1.0.2', systemWarning: 'Aviso del Sistema:', renderingInterrupted: 'Se produjo una interrupción al cargar el entorno tridimensional.',
    currentMission: 'Proyecto Gaia · Misión actual', preparingMission: 'Preparando misión...', sound: 'Sonido', missionFocusDefault: 'Acercarse al sistema', commander: 'Comandante',
    profileEyebrow: 'Proyecto Gaia · Registro de tripulación', profileTitle: 'Identificación del comandante', profileSubtitle: 'Antes de tu primera misión, registra tu identificación en la tripulación.', commanderName: 'Nombre del comandante', commanderNamePlaceholder: 'Escribe tu nombre', chooseAvatar: 'Elige tu avatar', confirmIdentification: 'Confirmar identificación', editProfileTitle: 'Editar perfil del comandante', editProfileSubtitle: 'Actualiza cómo serás identificado en el Proyecto Gaia.', profileValidation: 'Escribe un nombre y elige un avatar.', profileSaveFailure: 'No se pudo guardar el perfil en este navegador. Revisa el almacenamiento e inténtalo de nuevo.',
    avatarAstronaut: 'Astronauta', avatarScientist: 'Investigadora', avatarEngineer: 'Ingeniero', avatarCommander: 'Comandante', crewMember: 'Integrante de la tripulación',
    modeEyebrow: 'Año 2184 · Proyecto Gaia', modeTitle: '¿Cómo deseas explorar?', modeDescription: 'La humanidad creó una iniciativa científica para ampliar nuestro conocimiento sobre recursos, ambientes y fenómenos del Sistema Solar.', explorationDescription: 'Navega libremente por el simulador y consulta los cuerpos celestes.', missionDescription: 'Cumple objetivos científicos, responde preguntas y progresa en el Proyecto Gaia.',
    missionControlSpeaker: 'Dra. Helena Vega · Control de Misión', destinationConfirmed: 'Destino confirmado', prepareLaunch: 'Preparar lanzamiento', analysisEyebrow: 'Centro de Análisis · Proyecto Gaia', learnMore: 'Saber más', scientificSources: 'Fuentes científicas', sourcesReviewed: 'Contenido revisado el {date}. Los enlaces oficiales se abren en una pestaña nueva.',
    personalArchive: 'Archivo personal · Proyecto Gaia', completed: 'Completadas', attempts: 'Intentos', accuracy: 'Precisión', discoveryArchive: 'Archivo de descubrimientos', investigationComplete: 'Investigación completada', currentMissionStatus: 'Misión actual', locked: 'Bloqueado', dossier: 'Informe', train: 'Entrenar', replayJourney: 'Repetir viaje', trainingEyebrow: 'Simulación de entrenamiento · Sin XP', nextQuestion: 'Siguiente pregunta', backToJournal: 'Volver al diario', finishTraining: 'Finalizar entrenamiento', freeTraining: 'Entrenamiento libre: ninguna recompensa oficial de XP será modificada.', trainingIncorrect: 'Respuesta incorrecta. Consulta el informe después o inténtalo de nuevo.', trainingCorrect: 'Respuesta correcta. Este resultado no modifica el XP oficial.', trainingTitle: 'Entrenamiento: {target}',
    scientificAnalysis: 'Análisis científico', transmittedReport: 'Informe transmitido', firstCycleComplete: 'Primer ciclo completado', campaignDefaultText: 'Las investigaciones científicas han finalizado. Tu conocimiento ayudará a orientar las próximas etapas del Proyecto Gaia.', calculatingRoute: 'Calculando ruta...',
    closeJournal: 'Cerrar diario', closeChallenge: 'Cerrar desafío', closeExpedition: 'Cerrar expedición', closeInformation: 'Cerrar información', closeAbout: 'Cerrar acerca del proyecto', languageLabel: 'Idioma de la interfaz', campaignProgress: 'Progreso de la campaña', rocketLabel: 'Cohete del Proyecto Gaia',
    restartConfirm: 'Reiniciar la campaña borrará el XP y el progreso de las misiones. Tu nombre y avatar se conservarán. ¿Deseas continuar?', restartSuccess: 'Campaña reiniciada. La primera misión está disponible nuevamente.', incorrectTarget: '{body} no es el objetivo de esta misión. Continúa investigando.', duplicateEvidence: 'La evidencia de {body} ya fue registrada.', hostFollowing: 'Siguiendo a {body}. Arrastra para girar la cámara y busca {target} a su alrededor.', evidenceRecorded: 'Evidencia registrada: {body} ({observed}/{total}). Falta: {remaining}.', backOverview: 'Volver a la vista general', focusBody: 'Acercarse a {body}', cameraFollowing: 'Cámara siguiendo a {body}. Arrastra para girar, usa el zoom y selecciona {target}.', movementFrozen: 'Movimiento congelado',
    answerCorrectNext: 'Respuesta correcta: +{xp} XP. Siguiente análisis:', campaignSummary: 'Se completaron {missions} investigaciones. Acumulaste {xp} XP y alcanzaste el nivel {level}.', objectivePrefix: 'Objetivo: {objective}', launchConfirmation: '{target} confirmado. Autoriza el despegue para iniciar el análisis científico.', destinationReached: 'Destino alcanzado: +{xp} XP. Usa los datos recopilados.', useScannerData: 'Usa los datos recopilados por el escáner.', missionCompletedReward: 'Misión completada: +{xp} XP en esta pregunta · {stars}', selectedMismatch: '“{selected}” no coincide con las evidencias recopiladas.', routeConfirmed: 'Ruta confirmada hacia {target}', launchWord: 'LANZAR',
    levelCadet: 'Cadete', levelExplorer: 'Explorador', levelResearcher: 'Investigador', levelCommander: 'Comandante', levelPlanetarySpecialist: 'Especialista Planetario', levelSolarExplorer: 'Explorador del Sistema Solar', levelFrontierPioneer: 'Pionero de las Fronteras'
  }
};

export class MissionLocale extends EventTarget {
  constructor() {
    super();
    this.selector = document.getElementById('langSelect');
    this.language = this.selector.value || 'pt';
    this.selector.addEventListener('change', () => this.setLanguage(this.selector.value));
    this.apply();
  }

  t(key, parameters = {}) {
    const template = messages[this.language]?.[key] ?? messages.pt[key] ?? key;
    return Object.entries(parameters).reduce(
      (text, [name, value]) => text.replaceAll(`{${name}}`, String(value)),
      template
    );
  }

  bodyName(name) { return nameTranslations[name]?.[this.language] ?? name; }

  levelName(name) {
    const keys = {
      Cadete: 'levelCadet', Explorador: 'levelExplorer', Pesquisador: 'levelResearcher', Comandante: 'levelCommander',
      'Especialista Planetário': 'levelPlanetarySpecialist', 'Explorador do Sistema Solar': 'levelSolarExplorer', 'Pioneiro das Fronteiras': 'levelFrontierPioneer'
    };
    return this.t(keys[name] ?? name);
  }

  localizeMission(mission) {
    if (!mission || this.language === 'pt') return mission;
    const translation = mission.translations?.[this.language];
    if (!translation) return mission;
    return { ...mission, ...translation, questions: translation.questions ?? mission.questions, dossier: translation.dossier ?? mission.dossier };
  }

  hasMissionTranslation(mission) {
    return this.language === 'pt' || Boolean(mission?.translations?.[this.language]);
  }

  setLanguage(language) {
    this.language = messages[language] ? language : 'pt';
    this.apply();
    this.dispatchEvent(new CustomEvent('locale:changed', { detail: { language: this.language } }));
  }

  apply() {
    document.documentElement.lang = this.language === 'pt' ? 'pt-BR' : this.language;
    document.title = this.t('appTitle');
    document.querySelectorAll('[data-i18n]').forEach((element) => {
      element.textContent = this.t(element.dataset.i18n);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
      element.setAttribute('placeholder', this.t(element.dataset.i18nPlaceholder));
    });
    document.querySelectorAll('[data-i18n-title]').forEach((element) => {
      element.setAttribute('title', this.t(element.dataset.i18nTitle));
    });
    document.querySelectorAll('[data-i18n-aria-label]').forEach((element) => {
      element.setAttribute('aria-label', this.t(element.dataset.i18nAriaLabel));
    });
    document.querySelectorAll('.gaia-rocket-icon[role="img"]').forEach((element) => {
      element.setAttribute('aria-label', this.t('rocketLabel'));
    });
    const notice = document.getElementById('missionLanguageNotice');
    notice.textContent = this.t('contentNotice');
    notice.hidden = !this.t('contentNotice');
  }
}

export const missionLocale = new MissionLocale();
