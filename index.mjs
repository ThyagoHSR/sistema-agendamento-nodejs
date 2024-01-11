//external modules
import inquirer from 'inquirer'
import chalk from 'chalk'

//internal modules
import fs from 'fs'

console.log(chalk.bgBlue.blue(`Olá seja Bem-vindo ao sistema de agendamento daClínica de Consultas Ágil`))
operation()

function operation(){

  inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'O que Você deseja fazer ?',
      choices: [
        'Cadastrar um paciente',
        'Marcações de consultas',
        'Cancelamento de consultas',
        'Sair'
      ]
    }
  ]).then((answer) => {
     
      const action = answer['action']

        if(action === 'Cadastrar um paciente'){

          createPatient()

        }
        if(action === 'Marcações de consultas'){

          scheduleAppointment();

        }
        if(action === 'Cancelamento de consultas'){

          cancelAppointment()

        }
        if (action === 'Sair'){

          exit()
          
      }
  })
  .catch((err) => console.log(err))
}

function createPatient() {
  inquirer.prompt([
    {
      name: 'patientName',
      message: 'Digite o nome do paciente: '
    },
    {
      name: 'patientPhone',
      message: 'Digite o numero do paciente: '
    }
  ]).then(answer => {
    const {patientName, patientPhone} = answer;
    if (!fs.existsSync('Pacientes')) {
      fs.mkdirSync('Pacientes');
    }

    if (fs.existsSync(`Pacientes/${patientName}.json`)) {
      console.log(chalk.bgRed.black('Este paciente já existe!'));
      createPatient();
      return;
    }

    const patientData = {
      "Nome do paciente": patientName,
      "telefone": patientPhone
    };
    fs.writeFileSync(`Pacientes/${patientName}.json`, JSON.stringify(patientData, null, 2));

    console.log(chalk.bgGreen('Paciente cadastrado com sucesso!'));
    operation()
  }).catch(error => {
    console.error('Erro ao criar paciente:', error);
  });

}


function scheduleAppointment() {
  const patients = fs.readdirSync('Pacientes').map(file => file.replace('.json', ''));

  inquirer.prompt([
    {
      type: 'list',
      name: 'selectedPatient',
      message: 'Escolha um paciente para agendar consulta:',
      choices: patients
    },
    {
      name: 'appointmentDate',
      message: 'Digite a data da consulta (DD/MM/YYYY):'
    },
    {
      name: 'appointmentTime',
      message: 'Digite a hora da consulta (HH:MM):'
    },
    {
      name: 'specialty',
      message: 'Digite a especialidade desejada:'
    }
  ]).then(answers => {
    const { selectedPatient, appointmentDate, appointmentTime, specialty } = answers;

    const appointmentDetails = {
      "Data": appointmentDate,
      "Hora": appointmentTime,
      "Especialidade": specialty
    };


    const patientFilePath = `Pacientes/${selectedPatient}.json`;
    const patientData = JSON.parse(fs.readFileSync(patientFilePath, 'utf8'));

  
    if (!patientData.agendamentos) {
      patientData.agendamentos = [];
    }
    patientData.agendamentos.push(appointmentDetails);

   
    fs.writeFileSync(patientFilePath, JSON.stringify(patientData, null, 2));

    console.log(chalk.bgGreen('Agendamento criado com sucesso!'));
    operation();
  }).catch(error => {
    console.error('Erro ao agendar consulta:', error);
  });
  
}

function cancelAppointment() {
  
  const patients = fs.readdirSync('Pacientes').map(file => file.replace('.json', ''));

  const allAppointments = [];

  patients.forEach(patient => {
    const patientData = JSON.parse(fs.readFileSync(`Pacientes/${patient}.json`, 'utf8'));
    if (patientData.agendamentos && patientData.agendamentos.length > 0) {
      patientData.agendamentos.forEach((appointment, index) => {
        allAppointments.push({
          paciente: patient,
          ...appointment,
          numero: index + 1
        });
      });
    }
  });

  if (allAppointments.length === 0) {
    console.log(chalk.bgYellow.black('Não há agendamentos para cancelar.'));
    operation();
    return;
  }

  inquirer.prompt([
    {
      type: 'list',
      name: 'selectedAppointment',
      message: 'Escolha o agendamento que deseja cancelar:',
      choices: allAppointments.map(appointment => ({
        name: `Paciente: ${appointment.paciente}, Data: ${appointment.Data}, Hora: ${appointment.Hora}, Especialidade: ${appointment.Especialidade}`,
        value: appointment
      }))
    }
  ]).then(answer => {
    const selectedAppointment = answer.selectedAppointment;

    inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirmCancel',
        message: `Você deseja cancelar a consulta do paciente ${selectedAppointment.paciente} marcada para ${selectedAppointment.Data} às ${selectedAppointment.Hora}?`
      }
    ]).then(confirmAnswer => {
      if (confirmAnswer.confirmCancel) {
        const patientData = JSON.parse(fs.readFileSync(`Pacientes/${selectedAppointment.paciente}.json`, 'utf8'));
        patientData.agendamentos.splice(selectedAppointment.numero - 1, 1);
        fs.writeFileSync(`Pacientes/${selectedAppointment.paciente}.json`, JSON.stringify(patientData, null, 2));
        console.log(chalk.bgGreen('Agendamento cancelado com sucesso!'));
      } else {
        console.log(chalk.bgYellow.black('Operação de cancelamento cancelada pelo usuário.'));
      }
      operation();
    });
  }).catch(error => {
    console.error('Erro ao cancelar consulta:', error);
  });
}
function exit (){
  inquirer.prompt([{
    type: 'list',
    name: 'actionExit',
    message: 'Você deseja mesmo sair ?',
    choices: [
        'Sim',
        'Não'
        ]
     },
]).then((answer) =>{
    const actionExit = answer['actionExit'] 

    if(actionExit === 'Sim'){
        console.log(chalk.bgBlue.black('Obrigado por usar o nosso sistema de agendamento :) !'),)
        process.exit()
    }
    else if(actionExit === 'Não'){
         operation()
    }

} )

}

