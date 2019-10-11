module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    paths: {
		sistema: '',						 //Nome do sistema
		source: './',   					 //Diretorio origem dos fontes 
		dist: 'dist',	 					 //Diretorio de distribuicao - para onde serao copiados os fontes		
		ftpServer: ''   	 				 //Endereco do servidor de ftp		 			 
    },
	
	copy: {
	  main: {
		expand: true,
		cwd : '<%= paths.source %>/',
		src: ['folder/**',
			  '**.js',   
			  'file.json'],
		dest: '<%= paths.dist %>/fontes',
		ignore:['folder/folder/**',   //Apaga a pasta raiz e todo o conteudo						        				           
				'folder/*/**',        //Apaga todo o conteudo da pasta raiz mas nao apaga a pasta raiz            
				'**.git']
	  }
	},
		
	compress: {
		zip: {
			options: {
				archive: '<%= paths.dist %>/zip/<%= paths.sistema %>'+grunt.template.today('yyyymmdd')+'.zip',
				mode: 'zip'
			},
			files: [
				{ 
				  expand: true, 
				  cwd : '<%= paths.dist %>/fontes',	
				  src: ['**']
				}
			]
		}
	},
	
	ftp_push: {
		build: {
		  options: {
			authKey: "key1",
			host: "<%= paths.ftpServer %>",
			dest: "./<%= ftpServerPath %>/"+grunt.template.today('yyyymmdd')
		  },
		  files: [
			{
			  expand: true,
			  cwd: '<%= paths.dist %>/zip/',
			  src: ['**/*']
			}
		  ]
		}
    },
  
	clean: {
		folder: ['<%= paths.dist %>/']
	}	
    
  });
  
  // Load the plugin 
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-ftp-push');
  grunt.loadNpmTasks('grunt-contrib-clean');
 
  

  //Tasks
  grunt.registerTask('help', '', function() {
    grunt.log.writeln('');
    grunt.log.writeln('grunt clone    Copia os arquivos do projeto para a pasta "dist".');
	grunt.log.writeln('grunt deploy   Gera arquivo .zip da pasta "dist" e envia para o ftp.');
	grunt.log.writeln('');
  });
  
  
  //Main Tasks  
  grunt.registerTask('clone', ['copy']);

  grunt.registerTask('deploy', function(){

	//Obtem ambiente para geracao no ftp: homologacao | producao 
	grunt.config.set('ftpServerPath', grunt.option('env') || 'homologacao');  	

	//Gera zip  		
	grunt.task.run('compress');

	//Envia para o ftp. Para gerar producao utilizar parametro --env=producao 		
	grunt.task.run('ftp_push');

	//Exclui estruturas de pastas criadas para gerar o deploy	
	grunt.task.run('clean');	
	
  });

  grunt.registerTask('default',['help']);

};